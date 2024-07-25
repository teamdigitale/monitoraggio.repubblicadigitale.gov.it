package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.transaction.annotation.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.commons.collections4.CollectionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.ServizioXCittadinoEntity;
import it.pa.repdgt.shared.entity.TipologiaServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.bean.DettaglioServizioBean;
import it.pa.repdgt.surveymgmt.bean.SchedaDettaglioServizioBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.constants.NoteCSV;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.ServizioMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.param.FiltroListaServiziParam;
import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;
import it.pa.repdgt.surveymgmt.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioXCittadinoRepository;
import it.pa.repdgt.surveymgmt.repository.TipologiaServizioRepository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import it.pa.repdgt.surveymgmt.util.CSVMapUtil;
import lombok.extern.slf4j.Slf4j;

@Service
@Validated
@Slf4j
public class ServizioService {
	@Autowired
	private ServizioMapper servizioMapper;
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private SezioneQ3Respository sezioneQ3Repository;
	@Autowired
	private ServizioSqlService servizioSQLService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private EnteService enteService;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private QuestionarioTemplateService questionarioTemplateService;
	@Autowired
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;

	@Autowired
	private TipologiaServizioRepository tipologiaServizioRepository;

	@Autowired
	private ServizioXCittadinoRepository servizioXCittadinoRepository;

	@Autowired
	private QuestionarioCompilatoRepository questionarioCompilatoRepository;

	@Autowired
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;

	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;

	@Autowired
	private ServizioSqlRepository servizioSqlRepository;

	@Autowired
	private SezioneQ3Respository sezioneQ3Respository;

	private ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * Recupera l'elenco dei servizi paginati sulla base della profilazione
	 * dell'utente loggato e dei filtri in input
	 * - ProfilazioneParama - contiene i dati della profilazione dell'utente loggato
	 * - FiltroListaServiziParam - contiene tutti i filtri da applicare all'elenco
	 * dei servizi
	 * 
	 */
	@LogMethod
	@LogExecutionTime
	public Page<ServizioEntity> getAllServiziPaginatiByProfilazioneAndFiltri(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaServiziParam filtroListaServizi,
			@NotNull final Pageable pagina) {
		// Recupero tutti i Servizi in base al ruolo profilato dell'utente loggato e in
		// base ai filtri selezionati
		final List<ServizioEntity> listaServizi = this.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(profilazione,
				filtroListaServizi);

		// Effettuo la paginazione della lista dei servizi recuperati in precedenza
		int start = (int) pagina.getOffset();
		int end = Math.min((start + pagina.getPageSize()), listaServizi.size());
		if (start > end) {
			throw new ServizioException("ERRORE: pagina richiesta inesistente", CodiceErroreEnum.G03);
		}
		return new PageImpl<ServizioEntity>(listaServizi.subList(start, end), pagina, listaServizi.size());
	}

	/**
	 * Recupera l'elenco dei servizi sulla base della profilazione dell'utente
	 * loggato e dei filtri in input
	 * - ProfilazioneParama - contiene i dati della profilazione dell'utente loggato
	 * - FiltroListaServiziParam - contiene tutti i filtri da applicare all'elenco
	 * dei servizi
	 * 
	 */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByProfilazioneUtenteLoggatoAndFiltri(
			@NotNull @Valid SceltaProfiloParam profilazione,
			@NotNull @Valid FiltroListaServiziParam filtroListaServizi) {
		// Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato
		// alla piattaforma
		final String codiceFiscaleUtenteLoggato = profilazione.getCfUtenteLoggato().trim().toUpperCase();
		final String codiceRuoloUtenteLoggato = profilazione.getCodiceRuoloUtenteLoggato().toString().trim()
				.toUpperCase();

		if (filtroListaServizi.getCriterioRicerca() != null) {
			filtroListaServizi.setCriterioRicerca(
					"%".concat(filtroListaServizi.getCriterioRicerca()).concat("%"));
		}

		// Devo mostare l'elenco dei servizi sulla base del ruolo con cui si è
		// profiliato l'utente loggato
		switch (codiceRuoloUtenteLoggato) {
			// Utente loggato si è profilato con ruolo DSCU
			case RuoliUtentiConstants.DSCU:
				return this.servizioSQLService.getAllServiziByPolicySCDAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio());

			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore
			// Programma
			case RuoliUtentiConstants.REG:
			case RuoliUtentiConstants.DEG:
				return this.servizioSQLService.getAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList(profilazione.getIdProgramma().toString()),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio());

			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore
			// Partner
			case RuoliUtentiConstants.REPP:
			case RuoliUtentiConstants.DEPP:
				return this.servizioSQLService.getAllServiziByReferenteODelegatoEntePartnerAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList(profilazione.getIdProgramma().toString()),
						Arrays.asList(profilazione.getIdProgetto().toString()),
						profilazione.getIdEnte(),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio());

			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore
			// Progetto
			case RuoliUtentiConstants.REGP:
			case RuoliUtentiConstants.DEGP:
				return this.servizioSQLService.getAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList(profilazione.getIdProgramma().toString()),
						Arrays.asList(profilazione.getIdProgetto().toString()),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio());

			// Se: Utente loggato si è profilato con ruolo FACILITATORE
			// Se: Utente loggato si è profilato con ruolo VOLONTARIO
			case RuoliUtentiConstants.VOLONTARIO:
			case RuoliUtentiConstants.FACILITATORE:
				return this.servizioSQLService.getAllServiziByFacilitatoreOVolontarioAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList(profilazione.getIdProgramma().toString()),
						Arrays.asList(profilazione.getIdProgetto().toString()),
						profilazione.getIdEnte(),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio(),
						codiceFiscaleUtenteLoggato);

			// Se: Utente loggato si è profilato con ruolo di DTD/ruolo_custom
			default:
				return this.servizioSQLService.getAllServiziByFiltro(
						filtroListaServizi.getCriterioRicerca(),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio());
		}
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackFor = Exception.class)
	public ServizioEntity creaServizio(
			@NotNull final ServizioRequest servizioRequest, boolean isMassivo) {

		final String codiceFiscaletenteLoggato = servizioRequest.getCfUtenteLoggato();
		final String ruoloUtenteLoggato = servizioRequest.getCodiceRuoloUtenteLoggato().toString();

		if (!this.utenteService.isUtenteFacilitatore(codiceFiscaletenteLoggato, ruoloUtenteLoggato)) {
			final String messaggioErrore = String.format(
					"Impossibile creare servizio. Utente con codice fiscale '%s' non ha ruolo FACILITATORE",
					codiceFiscaletenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S05);
		}

		ProgettoEntity progettoServizio = progettoService.getProgettoById(servizioRequest.getIdProgetto());
		if(servizioRequest.getDataServizio().before(progettoServizio.getDataInizioProgetto()) || servizioRequest.getDataServizio().after(progettoServizio.getDataFineProgetto())){
			final String messaggioErrore = "Impossibile creare servizio. La data del servizio deve essere compresa fra la data di inizio e data di fine progetto";
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.A06);
		}

		if(!isMassivo){
			// controllo unicità servizio su progetto
			EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = enteSedeProgettoFacilitatoreRepository
					.existsByChiave(
							servizioRequest.getCfUtenteLoggato(),
							servizioRequest.getIdEnteServizio(),
							servizioRequest.getIdProgetto(),
							servizioRequest.getIdSedeServizio());
			if (enteSedeProgettoFacilitatore == null) {
				throw new ResourceNotFoundException(NoteCSV.NOTE_UTENTE_SEDE_NON_ASSOCIATI_AL_PROGETTO,
						CodiceErroreEnum.C01);
			}

			List<ServizioEntity> listaServizi = getServizioByDatiControllo(servizioRequest, enteSedeProgettoFacilitatore.getId());
			if(CollectionUtils.isNotEmpty(listaServizi)){

				JSONObject rootNodeNuovoServizio = new JSONObject(servizioRequest.getSezioneQuestionarioCompilatoQ3());				
				for (ServizioEntity servizioRecuperato : listaServizi) {
					Optional<SezioneQ3Collection> optSezioneQ3Collection = sezioneQ3Respository
							.findById(servizioRecuperato.getIdTemplateCompilatoQ3());
					if (optSezioneQ3Collection.isPresent()) {
						JsonNode nodeActual = objectMapper.valueToTree(optSezioneQ3Collection.get().getSezioneQ3Compilato());
						JsonNode pathJson = nodeActual.path("json");
						JSONObject jsonObjectActual = new JSONObject(pathJson.asText());
						boolean isStessoServizio = true;
						if (!recuperaDescrizioneDaJson(jsonObjectActual, 6).equals(recuperaDescrizioneDaJson(rootNodeNuovoServizio, 6))) {
							isStessoServizio = false;
						}
						if (!recuperaDescrizioneDaJson(jsonObjectActual, 5).equals(recuperaDescrizioneDaJson(rootNodeNuovoServizio, 5))) {
							isStessoServizio = false;
						}
						if (!recuperaDescrizioneDaJson(jsonObjectActual, 4).equals(recuperaDescrizioneDaJson(rootNodeNuovoServizio, 4))) {
							isStessoServizio = false;
						}
						if (isStessoServizio) {
							final String messaggioErrore = "Impossibile creare servizio. Servizio già presente in banca dati";
							throw new ServizioException(messaggioErrore, CodiceErroreEnum.S10);
						} 
					}
				}
			}
	}
		// creo SezioneQ3Mongo
		final SezioneQ3Collection sezioneQ3Compilato = this.creaSezioneQ3(servizioRequest);

		// salvo servizio su MySql
		ServizioEntity servizioCreato = this.servizioSQLService.salvaServizio(servizioRequest,
				sezioneQ3Compilato.getId());

		// salvo SezioneQ3Compilato su MongoDB
		this.sezioneQ3Repository.save(sezioneQ3Compilato);

		return servizioCreato;
	}

	private List<ServizioEntity> getServizioByDatiControllo(ServizioRequest servizioRequest,
			EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey) {
		Optional<List<ServizioEntity>> servizioOpt = servizioSqlRepository
				.findAllByDataServizioAndDurataServizioAndTipologiaServizioAndIdEnteSedeProgettoFacilitatore(
						servizioRequest.getDataServizio(),
						servizioRequest.getDurataServizio(),
						String.join(", ", servizioRequest.getListaTipologiaServizi()), enteSedeProgettoFacilitatoreKey);
		if (servizioOpt.isPresent() && !servizioOpt.get().isEmpty()) {
			List<ServizioEntity> listaServizi = servizioOpt.get();
			return listaServizi;
		}
		return new ArrayList<>();
	}

	private Set<String> recuperaDescrizioneDaJson(JSONObject jsonObject, int index) {
        
        JSONArray properties = jsonObject.getJSONArray("properties");
        JSONObject ultimoOggetto = properties.getJSONObject(index);
        String ultimaChiave = ultimoOggetto.keys().next();
        JSONArray ultimoValoreArray = ultimoOggetto.getJSONArray(ultimaChiave);
		Set<String> result = IntStream.range(0, ultimoValoreArray.length())
                .mapToObj(ultimoValoreArray::getString)
                .collect(Collectors.toSet());
		return result;
        
    }

	@LogMethod
	@LogExecutionTime
	public SezioneQ3Collection creaSezioneQ3(@NotNull final ServizioRequest servizioRequest) {
		final SezioneQ3Collection sezioneQ3Collection = this.servizioMapper.toCollectionFrom(servizioRequest);
		sezioneQ3Collection.setId(UUID.randomUUID().toString());
		sezioneQ3Collection.setDataOraCreazione(new Date());
		sezioneQ3Collection.setDataOraUltimoAggiornamento(sezioneQ3Collection.getDataOraCreazione());
		return sezioneQ3Collection;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackFor = Exception.class)
	public void aggiornaServizio(
			@NotNull Long idServizioDaAggiornare,
			@NotNull @Valid ServizioRequest servizioDaAggiornareRequest) {
		if (!isAutorizzatoForGetSchedaDettaglioServizioAndEliminaServizio(idServizioDaAggiornare,
				servizioDaAggiornareRequest)) {
			throw new ServizioException("Errore permesso accesso alla risorsa", CodiceErroreEnum.A02);
		}
		final String codiceFiscaletenteLoggato = servizioDaAggiornareRequest.getCfUtenteLoggato();
		final String ruoloUtenteLoggato = servizioDaAggiornareRequest.getCodiceRuoloUtenteLoggato().toString();

		String nomeServizio = servizioDaAggiornareRequest.getNomeServizio();
		Optional<ServizioEntity> servizioDBFetch = this.servizioSQLService.getServizioByNomeUpdate(nomeServizio,
				idServizioDaAggiornare);
		if (servizioDBFetch.isPresent()) {
			final String messaggioErrore = String
					.format("Impossibile aggiornare il servizio. Servizio con nome=%s già esistente", nomeServizio);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S08);
		}

		if (!this.utenteService.isUtenteFacilitatore(codiceFiscaletenteLoggato, ruoloUtenteLoggato)) {
			final String messaggioErrore = String.format(
					"Impossibile aggiornare servizio. Utente con codice fiscale '%s' non ha ruolo FACILITATORE",
					codiceFiscaletenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S05);
		}

		// Aggiorno servizio su MySql
		final ServizioEntity servizioAggiornato = this.servizioSQLService.aggiornaServizio(idServizioDaAggiornare,
				servizioDaAggiornareRequest);

		// Recupero SezioneQ3Compilato
		final String idSezioneQ3Compilato = servizioAggiornato.getIdTemplateCompilatoQ3();
		final SezioneQ3Collection sezioneQ3CompilatoDBFetch = this.sezioneQ3Repository
				.findById(idSezioneQ3Compilato)
				.orElseThrow(() -> new ResourceNotFoundException(
						String.format("SezioneQ3Compilato con id=%s non presente", idSezioneQ3Compilato),
						CodiceErroreEnum.C01));

		// Salvo SezioneQ3Compilato con i dati da aggiornare su MongoDB
		final SezioneQ3Collection sezioneQ3DaAggiornare = this.servizioMapper
				.toCollectionFrom(servizioDaAggiornareRequest);
		sezioneQ3CompilatoDBFetch.setDataOraUltimoAggiornamento(new Date());
		sezioneQ3CompilatoDBFetch.setSezioneQ3Compilato(sezioneQ3DaAggiornare.getSezioneQ3Compilato());
		this.sezioneQ3Repository.save(sezioneQ3CompilatoDBFetch);
	}

	/**
	 * Recupera tutte le 'tipologie di servizio' associati ai servizi dell'utente
	 * che si è loggato
	 * con un determinato profilo
	 * 
	 */
	@LogMethod
	@LogExecutionTime
	public List<String> getAllTipologiaServizioFiltroDropdown(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaServiziParam filtroListaServizi) {
		return this.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(profilazione, filtroListaServizi)
				.stream()
				.flatMap(servizio -> servizio.getListaTipologiaServizi().stream())
				.map(tipologiaServizio -> tipologiaServizio.getTitolo())
				.distinct()
				.collect(Collectors.toList());
	}

	/**
	 * Recupera tutti gli stati servizi relativi all'utente che si è loggato
	 * con un determinato profilo
	 * 
	 */
	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiServizioFiltroDropdown(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaServiziParam filtroListaServizi) {
		// Recupero tutti i servizi in base all'utente profilato che si è loggato
		// e dei servizi recuperati prendo solo il campo stato
		return this.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(profilazione, filtroListaServizi)
				.stream()
				.map(ServizioEntity::getStato)
				.distinct()
				.collect(Collectors.toList());
	}

	public boolean isAutorizzatoForGetSchedaDettaglioServizioAndEliminaServizio(@NotNull Long idServizio,
			SceltaProfiloParam profilazioneParam) {
		switch (profilazioneParam.getCodiceRuoloUtenteLoggato()) {
			case RuoliUtentiConstants.REGP:
			case RuoliUtentiConstants.DEGP:
				return this.servizioSQLService.isServizioAssociatoARegpDegp(idServizio,
						profilazioneParam.getIdProgetto()) > 0;
			case RuoliUtentiConstants.REPP:
			case RuoliUtentiConstants.DEPP:
				return this.servizioSQLService.isServizioAssociatoAReppDepp(idServizio,
						profilazioneParam.getIdProgetto(), profilazioneParam.getIdEnte()) > 0;
			case RuoliUtentiConstants.FACILITATORE:
			case RuoliUtentiConstants.VOLONTARIO:
				return this.servizioSQLService.isServizioAssociatoAUtenteProgettoEnte(idServizio,
						profilazioneParam.getIdProgetto(), profilazioneParam.getIdEnte(),
						profilazioneParam.getCfUtenteLoggato()) > 0;
			default:
				return false;
		}
	}

	/**
	 * Recupera i dati da mostrare nella scheda 'Dettaglio servizio' a partire
	 * dall'id del servizio
	 * 
	 */
	@LogMethod
	@LogExecutionTime
	public SchedaDettaglioServizioBean getSchedaDettaglioServizio(@NotNull final Long idServizio,
			final SceltaProfiloParam profilazioneParam) {
		if (profilazioneParam != null
				&& !isAutorizzatoForGetSchedaDettaglioServizioAndEliminaServizio(idServizio, profilazioneParam)) {
			throw new ServizioException("Errore permesso accesso alla risorsa", CodiceErroreEnum.A02);
		}
		// Recupero servizio
		final ServizioEntity servizioEntity = this.servizioSQLService.getServizioById(idServizio);
		// Recupero ente che eroga il servizio e su quale sede
		final EnteEntity enteEntity = this.enteService
				.getById(servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdEnte());
		final SedeEntity sedeEntity = this.sedeService
				.getById(servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdSede());

		final SchedaDettaglioServizioBean schedaDettaglioServizioBean = new SchedaDettaglioServizioBean();
		final DettaglioServizioBean dettaglioServizioBean = new DettaglioServizioBean();
		dettaglioServizioBean.setNomeServizio(servizioEntity.getNome());
		dettaglioServizioBean.setDataServizio(servizioEntity.getDataServizio());
		dettaglioServizioBean.setDataOraCreazione(servizioEntity.getDataOraCreazione());
		dettaglioServizioBean.setDataOraAggiornamento(servizioEntity.getDataOraAggiornamento());
		dettaglioServizioBean.setNomeEnte(enteEntity.getNome());
		dettaglioServizioBean.setNomeSede(sedeEntity.getNome());
		dettaglioServizioBean.setListaTipologiaServizio(servizioEntity.getListaTipologiaServizi());
		dettaglioServizioBean.setStatoServizio(servizioEntity.getStato());
		String idFacilitatore = servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdFacilitatore();
		String nominativoFacilitatore = this.servizioSQLService
				.getNominativoFacilitatoreByIdFacilitatoreAndIdServizio(idFacilitatore, servizioEntity.getId());
		dettaglioServizioBean.setNominativoFacilitatore(nominativoFacilitatore);

		// verifico se il questionarioTemplate associato al servizio è presente su Mysql
		try {
			this.questionarioTemplateSqlService
					.getQuestionarioTemplateById(servizioEntity.getIdQuestionarioTemplateSnapshot());
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format(
					"QuestionarioTemplate con id=%s associato al servizio non presente in MySql",
					servizioEntity.getIdQuestionarioTemplateSnapshot());
			throw new ServizioException(errorMessage, ex, CodiceErroreEnum.QT05);
		}

		// verifico se il questionarioTemplate associato al servizio è presente su
		// MongoDb
		QuestionarioTemplateCollection questionarioTemplateAssociatoAlServizio = null;
		try {
			questionarioTemplateAssociatoAlServizio = questionarioTemplateService
					.getQuestionarioTemplateById(servizioEntity.getIdQuestionarioTemplateSnapshot());
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format(
					"QuestionarioTemplate con id=%s associato al servizio non presente in MongoDB",
					servizioEntity.getIdQuestionarioTemplateSnapshot());
			throw new ServizioException(errorMessage, ex, CodiceErroreEnum.QT04);
		}
		dettaglioServizioBean.setQuestionarioTemplateSnapshot(questionarioTemplateAssociatoAlServizio);

		final Optional<SezioneQ3Collection> sezioneQ3Compilato = this.sezioneQ3Repository
				.findById(servizioEntity.getIdTemplateCompilatoQ3());
		dettaglioServizioBean.setSezioneQ3compilato(sezioneQ3Compilato.orElse(null));

		schedaDettaglioServizioBean.setDettaglioServizio(dettaglioServizioBean);

		final List<ProgettoProjection> progettiProjection = this.progettoService.getProgettiByServizio(idServizio);
		schedaDettaglioServizioBean.setProgettiAssociatiAlServizio(progettiProjection);
		return schedaDettaglioServizioBean;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackFor = Exception.class)
	public void eliminaServizio(@NotNull final Long idServizio, final SceltaProfiloParam profilazioneParam) {
		if (profilazioneParam != null
				&& !isAutorizzatoForGetSchedaDettaglioServizioAndEliminaServizio(idServizio, profilazioneParam)) {
			throw new ServizioException("Errore permesso accesso alla risorsa", CodiceErroreEnum.G01);
		}
		final ServizioEntity servizioEntity = this.servizioSQLService.getServizioById(idServizio);

		// Verifico se posso eliminare il servizio
		final String statoServizio = servizioEntity.getStato();
		if (!this.isServizioEliminabile(statoServizio)) {
			final String messaggioErrore = String.format(
					"Impossibile eliminare Servizio con id=%s. Stato Servizio = '%s'", idServizio, statoServizio);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S07);
		}

		// cancello servizio su MySql
		this.servizioSQLService.cancellaServivio(servizioEntity);

		// cancello SezioneQ3Compilato su MongoDB
		this.sezioneQ3Repository.deleteByIdSezioneQ3(servizioEntity.getIdTemplateCompilatoQ3());
	}

	@LogMethod
	@LogExecutionTime
	public boolean isServizioEliminabile(@NotNull final String statoServizio) {
		return StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoServizio);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional
	public void eliminaServizioForce(@NotNull Long idServizio) {

		ServizioEntity servizioEntity = this.servizioSQLService.getServizioById(idServizio);

		// Cancello questionario compilato
		List<QuestionarioCompilatoEntity> questionarioCompilatoEntityList = questionarioCompilatoRepository.findByIdServizioJPA(idServizio);
		for(QuestionarioCompilatoEntity questionario : questionarioCompilatoEntityList){
			questionarioCompilatoMongoRepository
					.deleteByIdQuestionarioTemplate(questionario.getId());
			this.questionarioCompilatoRepository.deleteById(questionario.getId());
		}

		// Cancello servizio x cittadino
		List<ServizioXCittadinoEntity> servizioXCittadinolist = servizioXCittadinoRepository.findByIdServizioJPA(idServizio);
		if (CollectionUtils.isNotEmpty(servizioXCittadinolist))
			 servizioXCittadinoRepository.deleteByIdServizioJPA(idServizio);

		// Cancello tipologie servizio
		List<TipologiaServizioEntity> tipologiaList = tipologiaServizioRepository.findByIdServizioJPA(idServizio);
		if (CollectionUtils.isNotEmpty(tipologiaList)) {
			for (TipologiaServizioEntity tipologia : tipologiaList) {
				tipologia.setServizio(null); // Rimuovi la referenza a ServizioEntity
				tipologiaServizioRepository.save(tipologia); // Salva le modifiche
				tipologiaServizioRepository.delete(tipologia); // Elimina l'entità
			}
		}
		// cancello SezioneQ3Compilato su MongoDB
		this.sezioneQ3Repository.deleteByIdSezioneQ3(servizioEntity.getIdTemplateCompilatoQ3());
		// cancello servizio su MySql
		this.servizioSQLService.cancellaServivio(servizioEntity);

	}
}