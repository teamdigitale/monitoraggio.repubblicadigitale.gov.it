package it.pa.repdgt.surveymgmt.service;

import java.util.*;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.bean.DettaglioCittadinoBean;
import it.pa.repdgt.surveymgmt.bean.DettaglioServizioSchedaCittadinoBean;
import it.pa.repdgt.surveymgmt.bean.SchedaCittadinoBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.surveymgmt.dto.CittadinoDto;
import it.pa.repdgt.surveymgmt.dto.SedeDto;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.mapper.CittadinoMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.DettaglioServizioSchedaCittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.CittadinoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;

@Service
public class CittadinoService {

	private static final String UTENTE_NON_FACILITATORE = "ERRORE: L'utente non è un facilitatore";
	@Autowired
	private CittadinoRepository cittadinoRepository;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private CittadinoMapper cittadinoMapper;
	@Autowired
	private QuestionarioCompilatoRepository questionarioCompilatoRepository;
	@Autowired
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;

	private static final String ID_Q1 = "anagraphic-citizen-section";

	@LogMethod
	@LogExecutionTime
	public CittadinoEntity getCittadinoById(Long idCittadino) {
		String errorMessage = String.format("Cittadino con id=%s non presente", String.valueOf(idCittadino));
		return this.cittadinoRepository.findById(idCittadino)
				.orElseThrow(() -> new ResourceNotFoundException(errorMessage, CodiceErroreEnum.C01));
	}

	@LogMethod
	@LogExecutionTime
	public List<CittadinoDto> getAllCittadiniPaginati(
			CittadiniPaginatiParam cittadiniPaginatiParam,
			Integer currPage,
			Integer pageSize) {
		String codiceRuoloUtente = cittadiniPaginatiParam.getCodiceRuoloUtenteLoggato();

		if (!RuoloUtenteEnum.FAC.toString().equals(codiceRuoloUtente)
				&& !RuoloUtenteEnum.VOL.toString().equals(codiceRuoloUtente)) {
			throw new CittadinoException(UTENTE_NON_FACILITATORE, CodiceErroreEnum.U06);
		}

		List<CittadinoProjection> cittadiniProjection = this
				.getAllCittadiniFacilitatorePaginatiByFiltro(cittadiniPaginatiParam, currPage, pageSize);
		return cittadiniProjection
				.stream()
				.map(cittadino -> {
					CittadinoDto cittadinoDto = new CittadinoDto();
					cittadinoDto.setId(cittadino.getId());
					cittadinoDto.setDataUltimoAggiornamento(cittadino.getDataUltimoAggiornamento());
					cittadinoDto.setCodiceFiscale(cittadino.getCodiceFiscale());
					cittadinoDto.setNumeroServizi(cittadino.getNumeroServizi());
					cittadinoDto.setNumeroQuestionariCompilati(cittadino.getNumeroQuestionariCompilati() == null ? 0L
							: cittadino.getNumeroQuestionariCompilati());
					return cittadinoDto;
				}).sorted(Comparator.comparing(CittadinoDto::getCodiceFiscale)).collect(Collectors.toList());
	}

	public List<CittadinoProjection> getAllCittadiniFacilitatoreByFiltro(
			CittadiniPaginatiParam cittadiniPaginatiParam) {
		FiltroListaCittadiniParam filtro = cittadiniPaginatiParam.getFiltro();
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsSedi;
		if (filtro.getIdsSedi() == null) {
			idsSedi = this.enteSedeProgettoFacilitatoreService.getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(
					cittadiniPaginatiParam.getCfUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto(),
					cittadiniPaginatiParam.getIdEnte());
		} else {
			idsSedi = filtro.getIdsSedi();
		}

		return this.cittadinoRepository.findAllCittadiniByFiltro(
				criterioRicerca,
				idsSedi,
				cittadiniPaginatiParam.getCfUtenteLoggato());
	}

	public List<CittadinoProjection> getAllCittadiniFacilitatorePaginatiByFiltro(
			CittadiniPaginatiParam cittadiniPaginatiParam,
			Integer currPage,
			Integer pageSize) {
		FiltroListaCittadiniParam filtro = cittadiniPaginatiParam.getFiltro();
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsSedi;
		if (filtro.getIdsSedi() == null) {
			idsSedi = this.enteSedeProgettoFacilitatoreService.getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(
					cittadiniPaginatiParam.getCfUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto(),
					cittadiniPaginatiParam.getIdEnte());
		} else {
			idsSedi = filtro.getIdsSedi();
		}

		return this.cittadinoRepository.findAllCittadiniPaginatiByFiltro(
				criterioRicerca,
				idsSedi,
				cittadiniPaginatiParam.getCfUtenteLoggato(),
				currPage * pageSize,
				pageSize);
	}

	public Integer getNumeroTotaleCittadiniFacilitatoreByFiltro(CittadiniPaginatiParam cittadiniPaginatiParam) {
		FiltroListaCittadiniParam filtro = cittadiniPaginatiParam.getFiltro();
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsSedi;
		if (filtro.getIdsSedi() == null) {
			idsSedi = this.enteSedeProgettoFacilitatoreService.getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(
					cittadiniPaginatiParam.getCfUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto(),
					cittadiniPaginatiParam.getIdEnte());
		} else {
			idsSedi = filtro.getIdsSedi();
		}

		return this.cittadinoRepository.findAllCittadiniByFiltro(
				criterioRicerca,
				idsSedi, cittadiniPaginatiParam.getCfUtenteLoggato()).size();
	}

	@LogMethod
	@LogExecutionTime
	public List<SedeDto> getAllSediDropdown(@Valid CittadiniPaginatiParam cittadiniPaginatiParam) {
		String codiceRuoloUtente = cittadiniPaginatiParam.getCodiceRuoloUtenteLoggato();

		if (!RuoloUtenteEnum.FAC.toString().equals(codiceRuoloUtente)
				&& !RuoloUtenteEnum.VOL.toString().equals(codiceRuoloUtente)) {
			throw new CittadinoException(UTENTE_NON_FACILITATORE, CodiceErroreEnum.U06);
		}

		List<SedeProjection> listaSediProjection = this.sedeService
				.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam);
		List<SedeDto> listaSediDto = listaSediProjection
				.stream()
				.map(record -> {
					SedeDto sedeDto = new SedeDto();
					sedeDto.setId(record.getId());
					sedeDto.setNome(record.getNome());
					return sedeDto;
				})
				.collect(Collectors.toList());

		return listaSediDto;
	}

	@LogMethod
	@LogExecutionTime
	public SchedaCittadinoBean getSchedaCittadinoById(Long idCittadino, SceltaProfiloParam profilazione) {
		CittadinoEntity cittadinoFetchDB = this.getCittadinoById(idCittadino);

		DettaglioCittadinoBean dettaglioCittadino = this.cittadinoMapper.toDettaglioCittadinoBeanFrom(cittadinoFetchDB);
		List<DettaglioServizioSchedaCittadinoProjection> serviziProjection = this
				.getDettaglioServiziSchedaCittadino(idCittadino);
		List<DettaglioServizioSchedaCittadinoBean> serviziBean = serviziProjection.stream().map(record -> {
			dettaglioCittadino.setProvincia(record.getProvincia());
			DettaglioServizioSchedaCittadinoBean dettaglioServizioSchedaCittadino = new DettaglioServizioSchedaCittadinoBean();
			dettaglioServizioSchedaCittadino.setIdServizio(record.getIdServizio());
			dettaglioServizioSchedaCittadino.setNomeServizio(record.getNomeServizio());
			String nomeCompletoFacilitatore = this.enteSedeProgettoFacilitatoreService
					.getNomeCompletoFacilitatoreByCodiceFiscale(record.getCodiceFiscaleFacilitatore());
			dettaglioServizioSchedaCittadino.setNomeCompletoFacilitatore(nomeCompletoFacilitatore);
			dettaglioServizioSchedaCittadino.setIdQuestionarioCompilato(record.getIdQuestionarioCompilato());
			dettaglioServizioSchedaCittadino.setStatoQuestionario(record.getStatoQuestionarioCompilato());
			dettaglioServizioSchedaCittadino.setNomeSede(record.getNomeSede());
			dettaglioServizioSchedaCittadino.setAssociatoAUtente(this.isAssociatoAUtente(profilazione,
					record.getCodiceFiscaleFacilitatore(), record.getIdProgetto(), record.getIdEnte()));
			return dettaglioServizioSchedaCittadino;
		}).collect(Collectors.toList());

		SchedaCittadinoBean schedaCittadino = new SchedaCittadinoBean();
		schedaCittadino.setDettaglioCittadino(dettaglioCittadino);
		schedaCittadino.setServiziCittadino(serviziBean);
		return schedaCittadino;
	}

	public Boolean isAssociatoAUtente(SceltaProfiloParam profilazione, String codiceFiscaleFacilitatore,
			Long idProgetto, Long idEnte) {
		String ruoloUtenteLoggato = profilazione.getCodiceRuoloUtenteLoggato();
		String codiceFiscaleUtenteLoggato = profilazione.getCfUtenteLoggato();

		switch (ruoloUtenteLoggato) {
			case "FAC":
			case "VOL":
				// controllo se il codice fiscale dell'utente loggato è uguale al codice fiscale
				// del facilitatore
				if (codiceFiscaleUtenteLoggato.equals(codiceFiscaleFacilitatore) &&
						profilazione.getIdProgetto().equals(idProgetto) &&
						profilazione.getIdEnte().equals(idEnte)) {
					return true;
				}
				return false;
			default:
				return true;
		}
	}

	public List<DettaglioServizioSchedaCittadinoProjection> getDettaglioServiziSchedaCittadino(Long idCittadino) {
		return this.cittadinoRepository.findDettaglioServiziSchedaCittadino(idCittadino);
	}

	@LogMethod
	@LogExecutionTime
	public Optional<CittadinoEntity> getCittadinoByCodiceFiscaleOrNumeroDocumento(
			final Boolean isCodiceFiscaleNonDisponibile,
			final String codiceFiscale,
			final String numeroDocumento) {
		if ((codiceFiscale == null || codiceFiscale.isEmpty()) &&
				(numeroDocumento == null || numeroDocumento.isEmpty()))
			throw new CittadinoException("ERRORE: occorre definire il CF o il numero documento", CodiceErroreEnum.U08);
		if (isCodiceFiscaleNonDisponibile == null || isCodiceFiscaleNonDisponibile) {
			return cittadinoRepository.findByNumeroDocumento(numeroDocumento);
		}
		return cittadinoRepository.findByCodiceFiscale(codiceFiscale);
	}

	@LogMethod
	@LogExecutionTime
	public Optional<CittadinoEntity> getByCodiceFiscaleOrNumeroDocumento(
			final String codiceFiscale,
			final String numeroDocumento) {
		return this.cittadinoRepository.findByCodiceFiscaleOrNumeroDocumento(codiceFiscale, numeroDocumento);
	}

	@LogMethod
	@LogExecutionTime
	public void salvaCittadino(CittadinoEntity cittadino) {
		this.cittadinoRepository.save(cittadino);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void aggiornaCittadino(Long id, CittadinoRequest cittadinoRequest) {
		String errorMessage = null;
		if (!this.cittadinoRepository.findById(id).isPresent()) {
			errorMessage = String.format("Impossibile aggiornare il cittadino. Cittadino con id=%s non presente", id);
			throw new CittadinoException(errorMessage, CodiceErroreEnum.CIT02);
		}
		CittadinoEntity cittadinoFetchDb = this.cittadinoRepository.findById(id).get();

		if (!this.getCittadinoPerCfOrNumDoc(cittadinoRequest.getCodiceFiscale(), cittadinoRequest.getNumeroDocumento(),
				id).isEmpty()) {
			errorMessage = String.format(
					"Impossibile aggiornare il cittadino. Cittadino con codice fiscale o numero documento già esistente");
			throw new CittadinoException(errorMessage, CodiceErroreEnum.U07);
		}

		CittadinoEntity cittadinoEntity = this.cittadinoMapper.toEntityFrom(cittadinoRequest);
		cittadinoEntity.setId(id);
		cittadinoEntity.setDataOraCreazione(cittadinoFetchDb.getDataOraCreazione());
		cittadinoEntity.setDataOraAggiornamento(new Date());

		// aggiorno cittadino su mysql
		this.cittadinoRepository.save(cittadinoEntity);

		// recupero tutte le collection 'questionariCompilato' per quel cittadino con
		// stato!=COMPILATO
		List<QuestionarioCompilatoEntity> questionariCompilatiCittadinoNonAncoraCompilati = this.questionarioCompilatoRepository
				.findQuestionariCompilatiByCittadinoAndStatoNonCompilato(id);
		questionariCompilatiCittadinoNonAncoraCompilati.forEach(questionarioNonAncoraCompilato -> {
			String idQuestionarioCompilato = questionarioNonAncoraCompilato.getId();
			Optional<QuestionarioCompilatoCollection> optionalQuestionarioCompilatoCollection = this.questionarioCompilatoMongoRepository
					.findQuestionarioCompilatoById(idQuestionarioCompilato);
			if (!optionalQuestionarioCompilatoCollection.isPresent()) {
				final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MongoDB",
						idQuestionarioCompilato);
				throw new QuestionarioCompilatoException(messaggioErrore, CodiceErroreEnum.QC02);
			}

			final QuestionarioCompilatoCollection questionarioCompilatoDBMongoFetch = optionalQuestionarioCompilatoCollection
					.get();

			// recupero tutte le sezioni del questioanario tranne la sezione Q1
			List<DatiIstanza> datiIstanzeSenzaQ1 = questionarioCompilatoDBMongoFetch
					.getSezioniQuestionarioTemplateIstanze()
					.stream()
					.filter(datiIstanza -> {
						JsonObject jsonDatiIstanza = (JsonObject) datiIstanza.getDomandaRisposta();
						return !jsonDatiIstanza.getJson().contains(ID_Q1.toLowerCase());
					})
					.collect(Collectors.toList());

			// costruisco la sezione del questionario Q1
			DatiIstanza datiIstanzaQ1 = new DatiIstanza();
			datiIstanzaQ1.setDomandaRisposta(new JsonObject(cittadinoRequest.getQuestionarioQ1()));

			List<DatiIstanza> nuoviDatiIstanzaQuestionarioCompilato = new ArrayList<>();
			nuoviDatiIstanzaQuestionarioCompilato.add(datiIstanzaQ1);
			nuoviDatiIstanzaQuestionarioCompilato.addAll(datiIstanzeSenzaQ1);

			questionarioCompilatoDBMongoFetch
					.setSezioniQuestionarioTemplateIstanze(nuoviDatiIstanzaQuestionarioCompilato);

			// cancello il questionarioCompilato corrente e successivamento lo risalvo con i
			// nuovi dati del q1
			this.questionarioCompilatoMongoRepository.deleteByIdQuestionarioTemplate(idQuestionarioCompilato);

			questionarioCompilatoDBMongoFetch.setMongoId(null);
			questionarioCompilatoDBMongoFetch.setDataOraUltimoAggiornamento(new Date());
			// salvo nuovamente il questionarioCompilato cancellato precedentemente ma con
			// la sezione Q1 aggiornata
			this.questionarioCompilatoMongoRepository.save(questionarioCompilatoDBMongoFetch);
		});
	}

	/**
	 * Restituisce la stringa contenente la tipologia di consenso
	 * data per il cittadino che ha quel dato codice fiscale o numero documento
	 */
	@LogMethod
	@LogExecutionTime
	public String getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(String codiceFiscaleCittadino,
			String numeroDocumento) {
		if (codiceFiscaleCittadino != null && !codiceFiscaleCittadino.isEmpty()) {
			return this.cittadinoRepository.findConsensoByCodiceFiscaleCittadino(codiceFiscaleCittadino);
		}
		if (numeroDocumento != null && !numeroDocumento.isEmpty()) {
			return this.cittadinoRepository.findConsensoByNumDocumentoCittadino(numeroDocumento);
		}
		return null;
	}

	public boolean isAutorizzato(Long idCittadino, @Valid SceltaProfiloParam profilazioneParam) {
		switch (profilazioneParam.getCodiceRuoloUtenteLoggato()) {
			case "FAC":
			case "VOL":
				return this.cittadinoRepository.isCittadinoAssociatoAFacVol(idCittadino,
						profilazioneParam.getCfUtenteLoggato(),
						profilazioneParam.getIdEnte(), profilazioneParam.getIdProgetto()) > 0;
			default:
				return false;
		}
	}

	public List<CittadinoEntity> getCittadinoPerCfOrNumDoc(String codiceFiscale, String numDocumento, Long id) {
		return cittadinoRepository.findCittadinoByCodiceFiscaleOrNumeroDocumentoAndIdDiverso(codiceFiscale,
				numDocumento, id);
	}
}