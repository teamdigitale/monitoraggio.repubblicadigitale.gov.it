package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
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
	
	@Autowired
	private CittadinoRepository cittadinoRepository;
	@Autowired
	private RuoloService ruoloService;
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
	
	@LogMethod
	@LogExecutionTime
	public CittadinoEntity getCittadinoById(Long idCittadino) {
		String errorMessage = String.format("Cittadino con id=%s non presente", String.valueOf(idCittadino));
		return this.cittadinoRepository.findById(idCittadino)
				.orElseThrow( () -> new ResourceNotFoundException(errorMessage));
	}

	@LogMethod
	@LogExecutionTime
	public Page<CittadinoDto> getAllCittadiniPaginati(
			CittadiniPaginatiParam cittadiniPaginatiParam,
			Integer currPage, 
			Integer pageSize) {
		String codiceRuoloUtente = cittadiniPaginatiParam.getCodiceRuoloUtenteLoggato().toString();
		
		 boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(cittadiniPaginatiParam.getCodiceFiscaleUtenteLoggato())
			.stream()
			.anyMatch(ruolo -> ruolo.getCodice().equals(codiceRuoloUtente));
		
		if(!hasRuoloUtente) {
			throw new CittadinoException("ERRORE: ruolo non definito per l'utente");
		}
		
		if(!RuoloUtenteEnum.FAC.toString().equals(codiceRuoloUtente)) {
			throw new CittadinoException("ERRORE: L'utente non è un facilitatore");
		}
		
		Pageable paginazione = PageRequest.of(currPage, pageSize);
		List<CittadinoProjection> cittadiniProjection = this.getAllCittadiniFacilitatoreFiltrati(cittadiniPaginatiParam);
		List<CittadinoDto> cittadini = cittadiniProjection
				.stream()
				.map(record -> {
					CittadinoDto cittadinoDto = new CittadinoDto();
					cittadinoDto.setId(record.getId());
					cittadinoDto.setNome(record.getNome());
					cittadinoDto.setCognome(record.getCognome());
					cittadinoDto.setNumeroServizi(record.getNumeroServizi());
					cittadinoDto.setNumeroQuestionariCompilati(record.getNumeroQuestionariCompilati());
					return cittadinoDto;
			})
			.collect(Collectors.toList());
		
		cittadini.sort((cittadino1, cittadino2) -> cittadino1.getId().compareTo(cittadino2.getId()));
		
		int start = (int) paginazione.getOffset();
		int end = Math.min((start + paginazione.getPageSize()), cittadini.size());
		
		if(start > end) {
			throw new CittadinoException("ERRORE: pagina richiesta inesistente");
		}
		
		return new PageImpl<CittadinoDto>(cittadini.subList(start, end), paginazione, cittadini.size());
	}
	
	private List<CittadinoProjection> getAllCittadiniFacilitatoreFiltrati( CittadiniPaginatiParam cittadiniPaginatiParam) {
		FiltroListaCittadiniParam filtro = cittadiniPaginatiParam.getFiltro();
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsSedi;
		if(filtro.getIdsSedi() == null) {
			idsSedi = this.enteSedeProgettoFacilitatoreService.getIdsSediFacilitatoreByCodFiscaleAndIdProgetto(cittadiniPaginatiParam.getCodiceFiscaleUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto());
		} else {
			idsSedi = filtro.getIdsSedi();
		}
		
		return this.cittadinoRepository.findAllCittadiniFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsSedi);
	}

	@LogMethod
	@LogExecutionTime
	public List<SedeDto> getAllSediDropdown(@Valid CittadiniPaginatiParam cittadiniPaginatiParam) {
		String codiceRuoloUtente = cittadiniPaginatiParam.getCodiceRuoloUtenteLoggato().toString();
		
		 boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(cittadiniPaginatiParam.getCodiceFiscaleUtenteLoggato())
			.stream()
			.anyMatch(ruolo -> ruolo.getCodice().equals(codiceRuoloUtente));
		
		if(!hasRuoloUtente) {
			throw new CittadinoException("ERRORE: ruolo non definito per l'utente");
		}
		
		if(!RuoloUtenteEnum.FAC.toString().equals(codiceRuoloUtente)) {
			throw new CittadinoException("ERRORE: L'utente non è un facilitatore");
		}
		
		List<SedeProjection> listaSediProjection = this.sedeService.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam);
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
	public SchedaCittadinoBean getSchedaCittadinoById(Long idCittadino) {
		CittadinoEntity cittadinoFetchDB = this.getCittadinoById(idCittadino);
		
		DettaglioCittadinoBean dettaglioCittadino = this.cittadinoMapper.toDettaglioCittadinoBeanFrom(cittadinoFetchDB);
		List<DettaglioServizioSchedaCittadinoProjection> serviziProjection = this.getDettaglioServiziSchedaCittadino(idCittadino);
		List<DettaglioServizioSchedaCittadinoBean> serviziBean = serviziProjection.stream().map(record -> {
			DettaglioServizioSchedaCittadinoBean dettaglioServizioSchedaCittadino = new DettaglioServizioSchedaCittadinoBean();
			dettaglioServizioSchedaCittadino.setIdServizio(record.getIdServizio());
			dettaglioServizioSchedaCittadino.setNomeServizio(record.getNomeServizio());
			String nomeCompletoFacilitatore = this.enteSedeProgettoFacilitatoreService.getNomeCompletoFacilitatoreByCodiceFiscale(record.getCodiceFiscaleFacilitatore());
			dettaglioServizioSchedaCittadino.setNomeCompletoFacilitatore(nomeCompletoFacilitatore);
			dettaglioServizioSchedaCittadino.setIdQuestionarioCompilato(record.getIdQuestionarioCompilato());
			dettaglioServizioSchedaCittadino.setStatoQuestionario(record.getStatoQuestionarioCompilato());
			return dettaglioServizioSchedaCittadino;
		}).collect(Collectors.toList());
		
		SchedaCittadinoBean schedaCittadino = new SchedaCittadinoBean();
		schedaCittadino.setDettaglioCittadino(dettaglioCittadino);
		schedaCittadino.setServiziCittadino(serviziBean);
		return schedaCittadino;
	}

	private List<DettaglioServizioSchedaCittadinoProjection> getDettaglioServiziSchedaCittadino(Long idCittadino) {
		return this.cittadinoRepository.findDettaglioServiziSchedaCittadino(idCittadino);
	}
	
	@LogMethod
	@LogExecutionTime
	public Optional<CittadinoEntity> getCittadinoByCodiceFiscaleOrNumeroDocumento(
			final Boolean isCodiceFiscaleNonDisponibile,
			final String codiceFiscale, 
			final String numeroDocumento) {
		if(isCodiceFiscaleNonDisponibile == null || isCodiceFiscaleNonDisponibile) {
			if(numeroDocumento == null || numeroDocumento.equals(""))
				throw new CittadinoException("ERRORE: occorre definire il CF o il numero documento");
			return cittadinoRepository.findByNumeroDocumento(numeroDocumento);
		}
		return cittadinoRepository.findByCodiceFiscale(codiceFiscale);
	}

	@LogMethod
	@LogExecutionTime
	public Optional<CittadinoEntity> getByCodiceFiscaleOrNumeroDocumento(
			final String codiceFiscale, 
			final String numeroDocumento ) {
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
		if(!this.cittadinoRepository.findById(id).isPresent()) {
			String messaggioErrore = String.format("Impossibile aggiornare il cittadino. Cittadino con id=%s non presente", id);
			throw new CittadinoException(messaggioErrore);
		}
		
		CittadinoEntity cittadinoEntity = this.cittadinoMapper.toEntityFrom(cittadinoRequest);
		cittadinoEntity.setId(id);
		cittadinoEntity.setDataOraAggiornamento(new Date());
		
		// aggiorno cittadino su mysql
		this.cittadinoRepository.save(cittadinoEntity);
		
		// recupero tutte le collection 'questionariCompilato' per quel cittadino con stato!=COMPILATO
		List<QuestionarioCompilatoEntity> questionariCompilatiCittadinoNonAncoraCompilati = this.questionarioCompilatoRepository.findQuestionariCompilatiByCittadinoAndStatoNonCompilato(id);
		questionariCompilatiCittadinoNonAncoraCompilati.forEach(questionarioNonAncoraCompilato -> {
			String idQuestionarioCompilato = questionarioNonAncoraCompilato.getId();
			Optional<QuestionarioCompilatoCollection> optionalQuestionarioCompilatoCollection = this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(idQuestionarioCompilato);
	        if(!optionalQuestionarioCompilatoCollection.isPresent()) {
	            final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MongoDB", idQuestionarioCompilato);
	            throw new QuestionarioCompilatoException(messaggioErrore);
	        }
	        
	        final QuestionarioCompilatoCollection questionarioCompilatoDBMongoFetch = optionalQuestionarioCompilatoCollection.get();

	        // recupero tutte le sezioni del questioanario tranne la sezione Q1
	        List<DatiIstanza> datiIstanzeSenzaQ1 = questionarioCompilatoDBMongoFetch
	        		.getSezioniQuestionarioTemplateIstanze()
	        		.stream()
	        		.filter(datiIstanza -> { 
	        			JsonObject jsonDatiIstanza = (JsonObject) datiIstanza.getDomandaRisposta();
	        			return !jsonDatiIstanza.getJson().contains("Q1");
	        		})
	        		.collect(Collectors.toList());

	        // costruisco la sezione del questionario Q1
	        DatiIstanza datiIstanzaQ1 = new DatiIstanza();
	        datiIstanzaQ1.setDomandaRisposta(new JsonObject(cittadinoRequest.getQuestionarioQ1()));
	        
	        List<DatiIstanza> nuoviDatiIstanzaQuestionarioCompilato = new ArrayList<>();
	        nuoviDatiIstanzaQuestionarioCompilato.add(datiIstanzaQ1);
	        nuoviDatiIstanzaQuestionarioCompilato.addAll(datiIstanzeSenzaQ1);
	        
	        questionarioCompilatoDBMongoFetch.setSezioniQuestionarioTemplateIstanze(nuoviDatiIstanzaQuestionarioCompilato);
	        
	        // cancello il questionarioCompilato corrente e successivamento lo risalvo con i nuovi dati del q1
	        this.questionarioCompilatoMongoRepository.deleteByIdQuestionarioTemplate(idQuestionarioCompilato);
	        
	        questionarioCompilatoDBMongoFetch.setMongoId(null);
	        questionarioCompilatoDBMongoFetch.setDataOraUltimoAggiornamento(new Date());
	        // salvo nuovamente il questionarioCompilato cancellato precedentemente ma con la sezione Q1 aggiornata
	        this.questionarioCompilatoMongoRepository.save(questionarioCompilatoDBMongoFetch);
		});
	}

	/**
	 * Restituisce la stringa contenente la tipologia di consenso 
	 * data per il cittadino che ha quel dato codice fiscale
	 * */
	@LogMethod
	@LogExecutionTime
	public String getConsensoByCodiceFiscaleCittadino(String codiceFiscaleCittadino) {
		return this.cittadinoRepository.findConsensoByCodiceFiscale(codiceFiscaleCittadino);
	}
}