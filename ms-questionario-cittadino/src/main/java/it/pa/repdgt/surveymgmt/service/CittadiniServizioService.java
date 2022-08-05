package it.pa.repdgt.surveymgmt.service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.constants.DomandeStrutturaQ1AndQ2Constants;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entity.QuestionarioInviatoOnlineEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.ServizioXCittadinoEntity;
import it.pa.repdgt.shared.entity.key.ServizioCittadinoKey;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.bean.CittadinoServizioBean;
import it.pa.repdgt.surveymgmt.bean.CittadinoUploadBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniServizioParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import it.pa.repdgt.surveymgmt.projection.GetCittadinoProjection;
import it.pa.repdgt.surveymgmt.repository.CittadinoRepository;
import it.pa.repdgt.surveymgmt.repository.CittadinoServizioRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioInviatoOnlineRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioXCittadinoRepository;
import it.pa.repdgt.surveymgmt.request.NuovoCittadinoServizioRequest;
import it.pa.repdgt.surveymgmt.util.CSVServizioUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Validated
public class CittadiniServizioService implements DomandeStrutturaQ1AndQ2Constants{
	
	private static final String FORMATO_DATA_PATTERN = "dd-MM-yyyy";
	private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat(FORMATO_DATA_PATTERN);
	
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private CittadinoService cittadinoService;
	@Autowired
	private ServizioSqlService servizioSqlService;
	@Autowired
	private CittadinoServizioRepository cittadinoServizioRepository;
	@Autowired
	private CittadinoRepository cittadinoRepository;
	@Autowired
	private ServizioXCittadinoRepository servizioXCittadinoRepository;
	@Autowired
	private SezioneQ3Respository sezioneQ3Respository;
	@Autowired
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoService;
	@Autowired
	private QuestionarioCompilatoRepository questionarioCompilatoSqlRepository;
	@Autowired 
	private EmailService emailService;
	@Autowired
	private QuestionarioInviatoOnlineRepository questionarioInviatoOnlineRepository;
	@Autowired
	private ServizioSqlRepository servizioSqlRepository;

	@LogMethod
	@LogExecutionTime
	public CittadinoServizioBean getAllCittadiniServizioByProfilazioneAndFiltroPaginati(
			Long idServizio,
			@NotNull @Valid final ProfilazioneParam profilazione,
			@NotNull @Valid final FiltroListaCittadiniServizioParam filtroListaCittadiniServizio,
			@NotNull final Pageable pagina ) {
		CittadinoServizioBean bean = new CittadinoServizioBean();
		// Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato alla piattaforma
		final String codiceFiscaleUtenteLoggato = profilazione.getCodiceFiscaleUtenteLoggato().trim();
		final String codiceRuoloUtenteLoggato   = profilazione.getCodiceRuoloUtenteLoggato().toString();

		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		if( !this.utenteService.hasRuoloUtente(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.U06);
		}
		
		// Verifico se il facilitatore è il creatore di quel servizio
		if( !this.servizioSqlRepository.findByFacilitatoreAndIdServizio(codiceFiscaleUtenteLoggato, idServizio).isPresent() ) {
			final String messaggioErrore = String.format("Servizio non accessibile per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S03);
		}

		// Recupero tutti i cittadini del servizion con id idServizio in base ai filtri selezionati
		final List<CittadinoServizioProjection> listaCittadiniServizio = this.getAllServiziByProfilazioneAndFiltro(idServizio, filtroListaCittadiniServizio);

		// Effettuo la paginazione della lista dei servizi recuperati in precedenza
		int start = (int) pagina.getOffset();
		int end = Math.min((start + pagina.getPageSize()), listaCittadiniServizio.size());
		if(start > end) {
			throw new ServizioException("ERRORE: pagina richiesta inesistente", CodiceErroreEnum.G03);
		}	
		bean.setListaCittadiniServizio(new PageImpl<CittadinoServizioProjection>(listaCittadiniServizio.subList(start, end), pagina, listaCittadiniServizio.size()));
		bean.setNumCittadini(listaCittadiniServizio.size());
		bean.setNumQuestionariCompilati(
				listaCittadiniServizio.stream()
				.filter( c -> StatoQuestionarioEnum.COMPILATO.toString().equalsIgnoreCase(c.getStatoQuestionario()) )
				.count()
				);
		return bean;
	}

	private List<CittadinoServizioProjection> getAllServiziByProfilazioneAndFiltro(
			Long idServizio,
			@NotNull @Valid FiltroListaCittadiniServizioParam filtroListaCittadiniServizio) {
		String criterioRicercaCittadinoServizioLike = null;
		String criterioRicercaCittadinoServizio = null;
		if(filtroListaCittadiniServizio.getCriterioRicerca() != null) {
			criterioRicercaCittadinoServizio = filtroListaCittadiniServizio.getCriterioRicerca();
			criterioRicercaCittadinoServizioLike = "%".concat(criterioRicercaCittadinoServizio).concat("%");
		}

		return cittadinoServizioRepository.findAllCittadiniServizioByFiltro(idServizio, 
				criterioRicercaCittadinoServizio, 
				criterioRicercaCittadinoServizioLike, 
				filtroListaCittadiniServizio.getStatiQuestionario());
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiQuestionarioCittadinoServizioDropdown(
			Long idServizio,
			@NotNull @Valid final ProfilazioneParam profilazione,
			final FiltroListaCittadiniServizioParam filtroListaCittadiniServizio) {
		// Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato alla piattaforma
		final String codiceFiscaleUtenteLoggato = profilazione.getCodiceFiscaleUtenteLoggato().trim();
		final String codiceRuoloUtenteLoggato   = profilazione.getCodiceRuoloUtenteLoggato().toString();

		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		if( !this.utenteService.hasRuoloUtente(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.U06);
		}
		//recupero stati questionario dropdown
		return filtroListaCittadiniServizio.getStatiQuestionario().isEmpty() 
				? this.getAllStatiQuestionarioByProfilazioneAndFiltro(idServizio, filtroListaCittadiniServizio)
						: filtroListaCittadiniServizio.getStatiQuestionario();
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiQuestionarioByProfilazioneAndFiltro(
			Long idServizio,
			@NotNull @Valid FiltroListaCittadiniServizioParam filtroListaCittadiniServizio) {
		String criterioRicercaCittadinoServizioLike = null;
		String criterioRicercaCittadinoServizio = null;
		if(filtroListaCittadiniServizio.getCriterioRicerca() != null) {
			criterioRicercaCittadinoServizio = filtroListaCittadiniServizio.getCriterioRicerca();
			criterioRicercaCittadinoServizioLike = "%".concat(criterioRicercaCittadinoServizio).concat("%");
		}

		return cittadinoServizioRepository.getAllStatiQuestionarioCittadinoServizioDropdown(idServizio, 
				criterioRicercaCittadinoServizio, 
				criterioRicercaCittadinoServizioLike);
	}

	@LogMethod
	@LogExecutionTime
	public List<GetCittadinoProjection> getAllCittadiniByCodFiscOrNumDoc(String tipoDocumento,
			@NotNull String criterioRicerca) {		
		return cittadinoServizioRepository.getAllCittadiniByCodFiscOrNumDoc(tipoDocumento,
				tipoDocumento.equalsIgnoreCase("CF") 
				? criterioRicerca
						: "%".concat(criterioRicerca).concat("%"));
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public CittadinoEntity creaNuovoCittadino(
			@NotNull final Long idServizio, 
			@NotNull final NuovoCittadinoServizioRequest nuovoCittadinoRequest) {
		final Optional<CittadinoEntity> optionalCittadinoDBFetch = this.cittadinoService.getCittadinoByCodiceFiscaleOrNumeroDocumento(
				nuovoCittadinoRequest.getCodiceFiscaleNonDisponibile(),
				nuovoCittadinoRequest.getCodiceFiscale(),
				nuovoCittadinoRequest.getNumeroDocumento()
			);
		
		
		CittadinoEntity cittadino = new CittadinoEntity();
		if(optionalCittadinoDBFetch.isPresent()) {
			cittadino = optionalCittadinoDBFetch.get();
			// verifico se già esiste il cittadino per quel determinato servizio 
			// e in caso affermativo sollevo eccezione
			if(this.esisteCittadinoByIdServizioAndIdCittadino(idServizio, cittadino.getId())) {
				final String messaggioErrore = String.format(
						"Cittadino con codice fiscale=%s, numero documento=%s già esistente sul Servizio con id=%s", 
						cittadino.getCodiceFiscale(),
						cittadino.getNumeroDocumento(),
						idServizio
					);
				throw new CittadinoException(messaggioErrore, CodiceErroreEnum.U07);
			}
		} else {
			cittadino.setCodiceFiscale(nuovoCittadinoRequest.getCodiceFiscale());
			cittadino.setTipoDocumento(nuovoCittadinoRequest.getTipoDocumento());
			cittadino.setNumeroDocumento(nuovoCittadinoRequest.getNumeroDocumento());
			cittadino.setCognome(nuovoCittadinoRequest.getCognome());
			cittadino.setNome(nuovoCittadinoRequest.getNome());
			cittadino.setEmail(nuovoCittadinoRequest.getEmail());
			cittadino.setDataOraCreazione(new Date());
			cittadino.setDataOraAggiornamento(new Date());
			cittadino.setAnnoDiNascita(nuovoCittadinoRequest.getAnnoNascita());
			cittadino.setCategoriaFragili(nuovoCittadinoRequest.getCategoriaFragili());
			cittadino.setCittadinanza(nuovoCittadinoRequest.getCittadinanza());
			cittadino.setComuneDiDomicilio(nuovoCittadinoRequest.getComuneDomicilio());
			cittadino.setGenere(nuovoCittadinoRequest.getGenere());
			cittadino.setNumeroDiCellulare(nuovoCittadinoRequest.getNumeroCellulare());
			cittadino.setOccupazione(nuovoCittadinoRequest.getStatoOccupazionale());
			cittadino.setPrefissoTelefono(nuovoCittadinoRequest.getPrefisso());
			cittadino.setTelefono(nuovoCittadinoRequest.getTelefono());
			cittadino.setTitoloDiStudio(nuovoCittadinoRequest.getTitoloStudio());
			cittadino = cittadinoRepository.save(cittadino);
		}
		
		//associo il cittadino al servizio
		this.associaCittadinoAServizio(idServizio, cittadino);
		
		//recupero il servizio 
		ServizioEntity servizioDBFetch = servizioSqlService.getServizioById(idServizio);
		
		if(StatoEnum.NON_ATTIVO.getValue().equals(servizioDBFetch.getStato()))
			servizioDBFetch.setStato(StatoEnum.ATTIVO.getValue());
		
		//creo il questionario in stato NON_INVIATO
		this.creaQuestionarioNonInviato(servizioDBFetch, cittadino);
		
		return cittadino;
	}

	public boolean esisteCittadinoByIdServizioAndIdCittadino(@NotNull final Long idServizio, @NotNull final Long idCittadino) {
		return this.servizioXCittadinoRepository.findCittadinoByIdServizioAndIdCittadino(idServizio, idCittadino) > 0;
	}
	
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void associaCittadinoAServizio(@NotNull final Long idServizio, @NotNull final CittadinoEntity cittadino) {
		ServizioXCittadinoEntity servizioXCittadino = new ServizioXCittadinoEntity();
		ServizioCittadinoKey key = new ServizioCittadinoKey(cittadino.getId(), idServizio);
		servizioXCittadino.setId(key);
		servizioXCittadino.setDataOraAggiornamento(new Date());
		servizioXCittadino.setDataOraCreazione(new Date());
		servizioXCittadinoRepository.save(servizioXCittadino);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void creaQuestionarioNonInviato(@NotNull final ServizioEntity servizioDBFetch, @NotNull final CittadinoEntity cittadino){
		
		//creo il template questionario compilato per Mongo
		QuestionarioCompilatoCollection questionarioCompilatoCreato = creoQuestionarioCompilatoCollection(
				cittadino,
				servizioDBFetch
			);

		//salvo il questionario compilato su MySql
		this.salvaQuestionarioCompilatoSql(cittadino, servizioDBFetch, questionarioCompilatoCreato);
		
		//salvo il questionario Compilato su Mongo
		this.questionarioCompilatoMongoService.save(questionarioCompilatoCreato);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public QuestionarioCompilatoCollection creoQuestionarioCompilatoCollection(
			CittadinoEntity cittadino,
			ServizioEntity servizio) {
		Optional<SezioneQ3Collection> SezioneQuestionarioQ3DBFetch = sezioneQ3Respository.findById(servizio.getIdTemplateCompilatoQ3());
		
		List<DatiIstanza> sezioniQuestionarioTemplateIstanze = new ArrayList<>();
		
		String jsonStringSezioneQ1 = this.creaSezioneQuestionarioQ1ByCittadino(cittadino);
		
		//creo questionario compilato inserendo sezione: Q1 (Anagrafica Cittadino), Q3 (Anagrafica Servizio)
		QuestionarioCompilatoCollection questionarioCompilato = new QuestionarioCompilatoCollection();
		questionarioCompilato.setIdQuestionarioCompilato(UUID.randomUUID().toString());
		DatiIstanza q1 = new DatiIstanza();
		q1.setDomandaRisposta(new JsonObject(jsonStringSezioneQ1));
		
		String jsonStringSezioneQ2 = this.creaSezioneQuestionarioQ2ByCittadino(cittadino.getId(), servizio.getId());
		DatiIstanza q2 = new DatiIstanza();
		q2.setDomandaRisposta(new JsonObject(jsonStringSezioneQ2));
		
		DatiIstanza q3 = new DatiIstanza();
		q3.setDomandaRisposta(SezioneQuestionarioQ3DBFetch.get().getSezioneQ3Compilato());
		sezioniQuestionarioTemplateIstanze.add(q1);
		sezioniQuestionarioTemplateIstanze.add(q2);
		sezioniQuestionarioTemplateIstanze.add(q3);
		questionarioCompilato.setSezioniQuestionarioTemplateIstanze(sezioniQuestionarioTemplateIstanze);
		questionarioCompilato.setDataOraCreazione(new Date());
		questionarioCompilato.setDataOraUltimoAggiornamento(new Date());
	
		return questionarioCompilato;
	}

	@LogMethod
	@LogExecutionTime
	public String creaSezioneQuestionarioQ1ByCittadino(@NotNull final CittadinoEntity cittadino) {
		final String jsonStringSezioneQ1 = String.format(SEZIONE_Q1_TEMPLATE,
				ID_DOMANDA_NOME, cittadino.getNome(),
				ID_DOMANDA_COGNOME, cittadino.getCognome(), 
				ID_DOMANDA_CODICE_FISCALE, cittadino.getCodiceFiscale(), 
				ID_DOMANDA_CODICE_FISCALE_NON_DISPONIBILE, cittadino.getCodiceFiscale() == null 
				|| cittadino.getCodiceFiscale().isEmpty(), 
				ID_DOMANDA_TIPO_DOCUMENTO, cittadino.getTipoDocumento(), 
				ID_DOMANDA_NUMERO_DOCUMENTO,cittadino.getNumeroDocumento(),
				ID_DOMANDA_GENERE,cittadino.getGenere(),
				ID_DOMANDA_ANNO_DI_NASCITA,cittadino.getAnnoDiNascita(),
				ID_DOMANDA_TITOLO_DI_STUDIO,cittadino.getTitoloDiStudio(),
				ID_DOMANDA_STATO_OCCUPAZIONALE,cittadino.getOccupazione(),
				ID_DOMANDA_CITTADINANZA,cittadino.getCittadinanza(),
				ID_DOMANDA_COMUNE_DI_DOMICILIO,cittadino.getComuneDiDomicilio(),
				ID_DOMANDA_CATEGORIE_FRAGILI,cittadino.getCategoriaFragili(),
				ID_DOMANDA_EMAIL, cittadino.getEmail(),
				ID_DOMANDA_PREFISSO,cittadino.getPrefissoTelefono(),
				ID_DOMANDA_NUMERO_CELLULARE,cittadino.getNumeroDiCellulare(),
				ID_DOMANDA_TELEFONO,cittadino.getTelefono(),
				ID_DOMANDA_TIPO_CONSENSO, cittadino.getTipoConferimentoConsenso() != null ? cittadino.getTipoConferimentoConsenso() : "$consenso",
				ID_DOMANDA_DATA_CONSENSO, cittadino.getDataConferimentoConsenso() != null ? 
						simpleDateFormat.format(cittadino.getDataConferimentoConsenso()) :
							"$dataConsenso");
		
		return jsonStringSezioneQ1;
	}
	
	@LogMethod
	@LogExecutionTime
	public String creaSezioneQuestionarioQ2ByCittadino(@NotNull final Long idCittadino, @NotNull final Long idServizio) {
		Optional<ServizioEntity> primoServizio = servizioSqlService.getPrimoServizioByIdCittadino(idServizio, idCittadino);
		Boolean esistePrimoServizio = primoServizio.isPresent();
		final String jsonStringSezioneQ2 = String.format(SEZIONE_Q2_TEMPLATE,
				ID_DOMANDA_PRIMA_VOLTA, esistePrimoServizio ? "NO" : "SI",
				ID_DOMANDA_TIPO_PRIMO_SERVIZIO, esistePrimoServizio ? primoServizio.get().getTipologiaServizio() : "");
		
		return jsonStringSezioneQ2;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void salvaQuestionarioCompilatoSql(
			@NotNull final CittadinoEntity cittadino, 
			@NotNull final ServizioEntity servizio,
			@NotNull final QuestionarioCompilatoCollection questionarioCompilatoCollection) {
		QuestionarioCompilatoEntity questCompilatoMySql;
		questCompilatoMySql = new QuestionarioCompilatoEntity();
		questCompilatoMySql.setId(questionarioCompilatoCollection.getIdQuestionarioCompilato());
		questCompilatoMySql.setDataOraCreazione(new Date());
		questCompilatoMySql.setCittadino(cittadino);
		questCompilatoMySql.setDataOraAggiornamento(new Date());
		questCompilatoMySql.setIdEnte(servizio.getIdEnteSedeProgettoFacilitatore().getIdEnte());
		questCompilatoMySql.setIdFacilitatore(servizio.getIdEnteSedeProgettoFacilitatore().getIdFacilitatore());
		questCompilatoMySql.setIdProgetto(servizio.getIdEnteSedeProgettoFacilitatore().getIdProgetto());
		questCompilatoMySql.setIdSede(servizio.getIdEnteSedeProgettoFacilitatore().getIdSede());
		questCompilatoMySql.setIdServizio(servizio.getId());
		questCompilatoMySql.setStato(StatoQuestionarioEnum.NON_INVIATO.toString());
		questCompilatoMySql.setIdQuestionarioTemplate(servizio.getIdQuestionarioTemplateSnapshot());
		
		this.questionarioCompilatoSqlRepository.save(questCompilatoMySql);
		
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public List<CittadinoUploadBean> caricaCittadiniSuServizio(MultipartFile fileCittadiniCSV, Long idServizio) {
		List<CittadinoUploadBean> esiti = new ArrayList<>();
		
		try {
			//estraggo i cittadini dal file csv
			List<CittadinoUploadBean> cittadiniUpload = CSVServizioUtil.csvToCittadini(fileCittadiniCSV.getInputStream());
		
			for(CittadinoUploadBean cittadinoUpload: cittadiniUpload) {
				Optional<CittadinoEntity> optionalCittadinoDBFetch = this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoUpload.getCodiceFiscale(), cittadinoUpload.getNumeroDocumento());				
				
				CittadinoEntity cittadino = new CittadinoEntity();
				//se il cittadino non esiste già a sistema
				if(!optionalCittadinoDBFetch.isPresent()) {
					//verifico se nel csv è stato passato almeno uno tra codice fiscale e num documento
					if(esisteCodFiscaleODocumento(cittadinoUpload)) {
						try{
							popolaCittadino(cittadino, cittadinoUpload);
							inserisciCittadino(cittadino, idServizio);
							cittadinoUpload.setEsitoUpload("UPLOAD - OK");
						}catch(NumberFormatException e){
							cittadinoUpload.setEsitoUpload("UPLOAD - KO - ANNO DI NASCITA IN FORMATO NON VALIDO");
						}
					}else {
						cittadinoUpload.setEsitoUpload("UPLOAD - KO - CF O NUM DOCUMENTO OBBLIGATORI");
					}
				}else {
					CittadinoEntity cittadinoDBFetch = optionalCittadinoDBFetch.get();
					// verifico se già esiste il cittadino per quel determinato servizio 
					// e in caso affermativo aggiungo KO
					if(this.esisteCittadinoByIdServizioAndIdCittadino(idServizio, cittadinoDBFetch.getId())) {
						cittadinoUpload.setEsitoUpload(String.format(
								"UPLOAD - KO - CITTADINO CON CODICE FISCALE=%s NUMERO DOCUMENTO=%s GIA' ESISTENTE SUL SERVIZIO CON ID %s",
								cittadinoDBFetch.getCodiceFiscale(),
								cittadinoDBFetch.getNumeroDocumento(),
								idServizio
							)
						);
					}else {
						cittadino.setId(cittadinoDBFetch.getId());
						try{
							popolaCittadino(cittadino, cittadinoUpload);
							inserisciCittadino(cittadino, idServizio);
							cittadinoUpload.setEsitoUpload("UPLOAD - OK");
						}catch(NumberFormatException e){
							cittadinoUpload.setEsitoUpload("UPLOAD - KO - ANNO DI NASCITA IN FORMATO NON VALIDO");
						}
					}
				}	
				esiti.add(cittadinoUpload);
			}
			
			return esiti;
		} catch (IOException e) {
			throw new ServizioException("Impossibile effettuare upload lista cittadini", e, CodiceErroreEnum.CIT01);
		}
	}

	public void inserisciCittadino(CittadinoEntity cittadino, Long idServizio) {
		cittadino = cittadinoRepository.save(cittadino);
		
		//associo il cittadino al servizio
		this.associaCittadinoAServizio(idServizio, cittadino);
		
		//recupero il servizio 
		ServizioEntity servizioDBFetch = servizioSqlService.getServizioById(idServizio);
		
		if(StatoEnum.NON_ATTIVO.getValue().equals(servizioDBFetch.getStato())) {
			servizioDBFetch.setStato(StatoEnum.ATTIVO.getValue());
			servizioSqlRepository.save(servizioDBFetch);
		}
		
		//creo il questionario in stato NON_INVIATO
		this.creaQuestionarioNonInviato(servizioDBFetch, cittadino);
		
	}

	public void popolaCittadino(CittadinoEntity cittadino, CittadinoUploadBean cittadinoUpload) {
		cittadino.setCodiceFiscale(cittadinoUpload.getCodiceFiscale());
		cittadino.setTipoDocumento(cittadinoUpload.getTipoDocumento());
		cittadino.setNumeroDocumento(cittadinoUpload.getNumeroDocumento());
		
		cittadino.setCognome(cittadinoUpload.getCognome());
		cittadino.setNome(cittadinoUpload.getNome());
		cittadino.setEmail(cittadinoUpload.getEmail());
		cittadino.setDataOraCreazione(new Date());
		cittadino.setDataOraAggiornamento(new Date());
		
		Integer annoDiNascita = Integer.parseInt(cittadinoUpload.getAnnoNascita());
		cittadino.setAnnoDiNascita(annoDiNascita);
		cittadino.setCategoriaFragili(cittadinoUpload.getCategoriaFragili());
		cittadino.setCittadinanza(cittadinoUpload.getCittadinanza());
		cittadino.setComuneDiDomicilio(cittadinoUpload.getComuneDomicilio());
		cittadino.setGenere(cittadinoUpload.getGenere());
		cittadino.setNumeroDiCellulare(cittadinoUpload.getNumeroCellulare());
		cittadino.setOccupazione(cittadinoUpload.getStatoOccupazionale());
		cittadino.setPrefissoTelefono(cittadinoUpload.getPrefisso());
		cittadino.setTelefono(cittadinoUpload.getTelefono());
		cittadino.setTitoloDiStudio(cittadinoUpload.getTitoloStudio());
		
	}

	public boolean esisteCodFiscaleODocumento(CittadinoUploadBean cittadinoUpload) {
		return cittadinoUpload.getCodiceFiscale() != null && !cittadinoUpload.getCodiceFiscale().isEmpty() ||
				cittadinoUpload.getNumeroDocumento() != null && !cittadinoUpload.getNumeroDocumento().isEmpty();
	}

	@LogMethod
	@LogExecutionTime
	public void inviaQuestionario(@NotNull final String idQuestionario, @NotNull final Long idCittadino) {
		QuestionarioCompilatoEntity questionarioCompilato = questionarioCompilatoSqlRepository.findById(idQuestionario)
				.orElseThrow(() -> new ServizioException("id questionario inesistente", CodiceErroreEnum.Q01) );
		CittadinoEntity cittadino = questionarioCompilato.getCittadino();
		if(cittadino == null || !idCittadino.equals(cittadino.getId())) {
			throw new ServizioException("coppia cittadino - id questionario inesistente", CodiceErroreEnum.Q01);
		}
		inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilato(idQuestionario, questionarioCompilato, cittadino);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilato(
			final String idQuestionario,
			QuestionarioCompilatoEntity questionarioCompilato, 
			CittadinoEntity cittadino) {
		inviaLinkAnonimo(cittadino,idQuestionario);
		questionarioCompilato.setStato(StatoQuestionarioEnum.INVIATO.getValue());
		questionarioCompilatoSqlRepository.save(questionarioCompilato);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void inviaLinkAnonimo(CittadinoEntity cittadino,String idQuestionario) {
		new Thread( () -> {
			try {
				String token = this.generaToken(cittadino, idQuestionario);
				String[] argsTemplate = new String[] { cittadino.getNome(), token};

				// stacco un thread per invio email
				this.emailService.inviaEmail(
					cittadino.getEmail(), 
					EmailTemplateEnum.QUESTIONARIO_ONLINE, 
					argsTemplate
				);
			} catch(Exception ex) {
				log.error("Impossibile inviare la mail al cittadino con id={}.", cittadino.getId());
				log.error("{}", ex);
				throw new ServizioException("Impossibile inviare la mail", ex, CodiceErroreEnum.E01);
			}
		}).start();
	}

	@Transactional(rollbackOn = Exception.class)
	@LogMethod
	@LogExecutionTime
	public String generaToken(CittadinoEntity cittadino, String idQuestionarioCompilato) {
		// Recupera QuestionarioInviato a partire dal questionario compialato e codice fiscale/numDocumento cittadino se esiste.
        // Altrimenti crea un QuestionarioInviato ex-novo
        QuestionarioInviatoOnlineEntity invioQuestionario = questionarioInviatoOnlineRepository
                .findByIdQuestionarioCompilatoAndCodiceFiscale(idQuestionarioCompilato, cittadino.getCodiceFiscale())
                .orElse(null);
        
        if(invioQuestionario == null) {
            invioQuestionario = questionarioInviatoOnlineRepository
                    .findByIdQuestionarioCompilatoAndNumDocumento(idQuestionarioCompilato, cittadino.getNumeroDocumento())
                    .orElse(new QuestionarioInviatoOnlineEntity());
        }
        
        invioQuestionario.setCodiceFiscale(cittadino.getCodiceFiscale());
        invioQuestionario.setNumDocumento(cittadino.getNumeroDocumento());
        invioQuestionario.setEmail(cittadino.getEmail());
        invioQuestionario.setIdQuestionarioCompilato(idQuestionarioCompilato);

        String token = UUID.randomUUID().toString();
        invioQuestionario.setToken(token);
        invioQuestionario.setDataOraCreazione(new Date());
        
        questionarioInviatoOnlineRepository.save(invioQuestionario);
        
        return token;
	}

	@Transactional
	@LogMethod
	@LogExecutionTime
	public void inviaQuestionarioATuttiCittadiniNonAncoraInviatoByServizio(Long idServizio) {
		// recupero tutti i questionari compilati con STATO = NON INVIATO per quel servizio
		List<QuestionarioCompilatoEntity> questionarioCompilatoList = this.questionarioCompilatoSqlRepository.findByIdServizioAndStato(idServizio, StatoQuestionarioEnum.NON_INVIATO.toString());
		
		questionarioCompilatoList
			.stream()
			.forEach(questionarioCompilato -> {
				String idQuestionarioCompilato = questionarioCompilato.getId();
				CittadinoEntity cittadinoAssociatoQuestionarioCompilato = questionarioCompilato.getCittadino();
				this.inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilato(idQuestionarioCompilato, questionarioCompilato, cittadinoAssociatoQuestionarioCompilato);
			});
	}
}