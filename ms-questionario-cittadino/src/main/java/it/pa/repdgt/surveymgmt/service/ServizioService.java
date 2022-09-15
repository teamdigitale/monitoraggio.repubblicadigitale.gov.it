package it.pa.repdgt.surveymgmt.service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.bean.DettaglioServizioBean;
import it.pa.repdgt.surveymgmt.bean.SchedaDettaglioServizioBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.ServizioMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.param.FiltroListaServiziParam;
import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;
import it.pa.repdgt.surveymgmt.repository.TipologiaServizioRepository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;

@Service
@Validated
public class ServizioService {
	@Autowired
	private ServizioMapper servizioMapper;
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private SezioneQ3Respository sezioneQ3Repository;
	@Autowired
	private TipologiaServizioRepository tipologiaServizioRepository;
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

	/**
	 * Recupera l'elenco dei servizi paginati sulla base della profilazione dell'utente loggato e dei filtri in input
	 * - ProfilazioneParama - contiene i dati della profilazione dell'utente loggato 
	 * - FiltroListaServiziParam - contiene tutti i filtri da applicare all'elenco dei servizi
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	public Page<ServizioEntity> getAllServiziPaginatiByProfilazioneAndFiltri(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaServiziParam filtroListaServizi,
			@NotNull final Pageable pagina ) {
		// Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato alla piattaforma
		final String codiceFiscaleUtenteLoggato = profilazione.getCfUtenteLoggato().trim().toUpperCase();
		final String codiceRuoloUtenteLoggato   = profilazione.getCodiceRuoloUtenteLoggato().toString().trim().toUpperCase();
		
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		if( !this.utenteService.hasRuoloUtente(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.U06);
		}
		
		// Recupero tutti i Servizi in base al ruolo profilato dell'utente loggato e in base ai filtri selezionati
		final List<ServizioEntity> listaServizi = this.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(profilazione, filtroListaServizi);
		
		// Effettuo la paginazione della lista dei servizi recuperati in precedenza
		int start = (int) pagina.getOffset();
		int end = Math.min((start + pagina.getPageSize()), listaServizi.size());
		if(start > end) {
			throw new ServizioException("ERRORE: pagina richiesta inesistente", CodiceErroreEnum.G03);
		}
		return new PageImpl<ServizioEntity>(listaServizi.subList(start, end), pagina, listaServizi.size());
	}
	
	/**
	 * Recupera l'elenco dei servizi sulla base della profilazione dell'utente loggato e dei filtri in input
	 * - ProfilazioneParama - contiene i dati della profilazione dell'utente loggato 
	 * - FiltroListaServiziParam - contiene tutti i filtri da applicare all'elenco dei servizi
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByProfilazioneUtenteLoggatoAndFiltri(
			@NotNull @Valid SceltaProfiloParam profilazione,
			@NotNull @Valid FiltroListaServiziParam filtroListaServizi) {
		// Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato alla piattaforma
		final String codiceFiscaleUtenteLoggato = profilazione.getCfUtenteLoggato().trim().toUpperCase();
		final String codiceRuoloUtenteLoggato   = profilazione.getCodiceRuoloUtenteLoggato().toString().trim().toUpperCase();
		
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		if( !this.utenteService.hasRuoloUtente(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.U01);
		}
		
		if(filtroListaServizi.getCriterioRicerca() != null) {
			filtroListaServizi.setCriterioRicerca(
					"%".concat(filtroListaServizi.getCriterioRicerca()).concat("%")
				);
		}

		// Devo mostare l'elenco dei servizi sulla base del ruolo con cui si è profiliato l'utente loggato
		switch (codiceRuoloUtenteLoggato) {
			// Utente loggato si è profilato con ruolo DSCU
			case RuoliUtentiConstants.DSCU:
				return this.servizioSQLService.getAllServiziByPolicySCDAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					);
			
			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore Programma
			case RuoliUtentiConstants.REG:
			case RuoliUtentiConstants.DEG:
				return this.servizioSQLService.getAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList( profilazione.getIdProgramma().toString() ),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					);

			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore Partner
			case RuoliUtentiConstants.REPP:
			case RuoliUtentiConstants.DEPP:
				return this.servizioSQLService.getAllServiziByReferenteODelegatoEntePartnerAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList( profilazione.getIdProgramma().toString() ),
						Arrays.asList( profilazione.getIdProgetto().toString() ),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					);
				
			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore Progetto
			case RuoliUtentiConstants.REGP:
			case RuoliUtentiConstants.DEGP:
				return this.servizioSQLService.getAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList( profilazione.getIdProgramma().toString() ),
						Arrays.asList( profilazione.getIdProgetto().toString() ),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					);
				
			// Se: Utente loggato si è profilato con ruolo FACILITATORE
			// Se: Utente loggato si è profilato con ruolo VOLONTARIO
			case RuoliUtentiConstants.VOLONTARIO:
			case RuoliUtentiConstants.FACILITATORE:
				return this.servizioSQLService.getAllServiziByFacilitatoreOVolontarioAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList( profilazione.getIdProgramma().toString() ),
						Arrays.asList( profilazione.getIdProgetto().toString() ),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio(),
						codiceFiscaleUtenteLoggato
					);
			
			// Se: Utente loggato si è profilato con ruolo di DTD/ruolo_custom
			default:
				return this.servizioSQLService.getAllServiziByFiltro(
						filtroListaServizi.getCriterioRicerca(),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					);
		}
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity creaServizio(
			@NotNull final ServizioRequest servizioRequest) {

		String nomeServizio = servizioRequest.getNomeServizio();
		Optional<ServizioEntity> servizioDBFetch = this.servizioSQLService.getServizioByNome(nomeServizio);
		if(servizioDBFetch.isPresent()) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Servizio con nome=%s già esistente", nomeServizio);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S08);
		}
		final String codiceFiscaletenteLoggato = servizioRequest.getProfilazioneParam().getCfUtenteLoggato();
		final String ruoloUtenteLoggato = servizioRequest.getProfilazioneParam().getCodiceRuoloUtenteLoggato().toString();
		
		if( ! this.utenteService.isUtenteFacilitatore(codiceFiscaletenteLoggato, ruoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Utente con codice fiscale '%s' non ha ruolo FACILITATORE", codiceFiscaletenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S05);
		}
		
		// creo SezioneQ3Mongo
		final SezioneQ3Collection sezioneQ3Compilato = this.creaSezioneQ3(servizioRequest);
		
		// salvo servizio su MySql
		ServizioEntity servizioCreato = this.servizioSQLService.salvaServizio(servizioRequest, sezioneQ3Compilato.getId());
		
		// salvo SezioneQ3Compilato su MongoDB
		this.sezioneQ3Repository.save(sezioneQ3Compilato);
		
		return servizioCreato;
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
	@Transactional(rollbackOn = Exception.class)
	public void aggiornaServizio(
			@NotNull Long idServizioDaAggiornare, 
			@NotNull @Valid ServizioRequest servizioDaAggiornareRequest) {
		final String codiceFiscaletenteLoggato = servizioDaAggiornareRequest.getProfilazioneParam().getCfUtenteLoggato();
		final String ruoloUtenteLoggato = servizioDaAggiornareRequest.getProfilazioneParam().getCodiceRuoloUtenteLoggato().toString();
		
		String nomeServizio = servizioDaAggiornareRequest.getNomeServizio();
		Optional<ServizioEntity> servizioDBFetch = this.servizioSQLService.getServizioByNomeUpdate(nomeServizio, idServizioDaAggiornare);
		if(servizioDBFetch.isPresent()) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Servizio con nome=%s già esistente", nomeServizio);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S08);
		}
		
		if( !this.utenteService.isUtenteFacilitatore(codiceFiscaletenteLoggato, ruoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Impossibile aggiornare servizio. Utente con codice fiscale '%s' non ha ruolo FACILITATORE", codiceFiscaletenteLoggato);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S05);
		}
		
		// Aggiorno servizio su MySql
		final ServizioEntity servizioAggiornato = this.servizioSQLService.aggiornaServizio(idServizioDaAggiornare, servizioDaAggiornareRequest);

		// Recupero SezioneQ3Compilato
		final String idSezioneQ3Compilato = servizioAggiornato.getIdTemplateCompilatoQ3();
		final SezioneQ3Collection sezioneQ3CompilatoDBFetch = this.sezioneQ3Repository
				.findById(idSezioneQ3Compilato)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("SezioneQ3Compilato con id=%s non presente", idSezioneQ3Compilato), CodiceErroreEnum.C01));

		
		// Salvo SezioneQ3Compilato con i dati da aggiornare su MongoDB
		final SezioneQ3Collection sezioneQ3DaAggiornare = this.servizioMapper.toCollectionFrom(servizioDaAggiornareRequest);
		sezioneQ3CompilatoDBFetch.setDataOraUltimoAggiornamento(new Date());
		sezioneQ3CompilatoDBFetch.setSezioneQ3Compilato(sezioneQ3DaAggiornare.getSezioneQ3Compilato());
		this.sezioneQ3Repository.save(sezioneQ3CompilatoDBFetch);
	}

	/**
	 * Recupera tutte le 'tipologie di servizio' associati ai servizi dell'utente che si è loggato
	 * con un determinato profilo
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	public List<String> getAllTipologiaServizioFiltroDropdown(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaServiziParam filtroListaServizi) {
		return this.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(profilazione, filtroListaServizi)
				.stream()
				.flatMap( servizio -> servizio.getListaTipologiaServizi().stream() )
				.map(tipologiaServizio -> tipologiaServizio.getTitolo())
				.distinct()
				.collect(Collectors.toList());
	}

	/**
	 * Recupera tutti gli stati servizi relativi all'utente che si è loggato
	 * con un determinato profilo
	 * 
	 * */
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

	/**
	 * Recupera i dati da mostrare nella scheda 'Dettaglio servizio' a partire
	 * dall'id del servizio
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	public SchedaDettaglioServizioBean getSchedaDettaglioServizio(@NotNull final Long idServizio) {
		// Recupero servizio
		final ServizioEntity servizioEntity = this.servizioSQLService.getServizioById(idServizio);
		// Recupero ente che eroga il servizio e su quale sede
		final EnteEntity enteEntity = this.enteService.getById(servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdEnte());
		final SedeEntity sedeEntity = this.sedeService.getById(servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdSede());
		
		final SchedaDettaglioServizioBean schedaDettaglioServizioBean = new SchedaDettaglioServizioBean();
		final DettaglioServizioBean dettaglioServizioBean = new DettaglioServizioBean();
		dettaglioServizioBean.setNomeServizio(servizioEntity.getNome());
		dettaglioServizioBean.setNomeEnte(enteEntity.getNome());
		dettaglioServizioBean.setNomeSede(sedeEntity.getNome());
		dettaglioServizioBean.setListaTipologiaServizio(servizioEntity.getListaTipologiaServizi());
		dettaglioServizioBean.setStatoServizio(servizioEntity.getStato());
		String idFacilitatore = servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdFacilitatore();
		String nominativoFacilitatore = this.servizioSQLService.getNominativoFacilitatoreByIdFacilitatoreAndIdServizio(idFacilitatore, servizioEntity.getId());
		dettaglioServizioBean.setNominativoFacilitatore(nominativoFacilitatore);

		// verifico se il questionarioTemplate associato al servizio è presente su Mysql
		try {
			this.questionarioTemplateSqlService.getQuestionarioTemplateById(servizioEntity.getIdQuestionarioTemplateSnapshot());
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("QuestionarioTemplate con id=%s associato al servizio non presente in MySql", servizioEntity.getIdQuestionarioTemplateSnapshot());
			throw new ServizioException(errorMessage, ex, CodiceErroreEnum.QT05);
		}

		// verifico se il questionarioTemplate associato al servizio è presente su MongoDb
		QuestionarioTemplateCollection questionarioTemplateAssociatoAlServizio = null;
		try {
			questionarioTemplateAssociatoAlServizio = questionarioTemplateService.getQuestionarioTemplateById(servizioEntity.getIdQuestionarioTemplateSnapshot());
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("QuestionarioTemplate con id=%s associato al servizio non presente in MongoDB", servizioEntity.getIdQuestionarioTemplateSnapshot());
			throw new ServizioException(errorMessage, ex, CodiceErroreEnum.QT04);
		}
		dettaglioServizioBean.setQuestionarioTemplateSnapshot(questionarioTemplateAssociatoAlServizio);

		final Optional<SezioneQ3Collection> sezioneQ3Compilato = this.sezioneQ3Repository.findById(servizioEntity.getIdTemplateCompilatoQ3());
		dettaglioServizioBean.setSezioneQ3compilato(sezioneQ3Compilato.orElse(null));
		
		schedaDettaglioServizioBean.setDettaglioServizio(dettaglioServizioBean);
		
		final List<ProgettoProjection> progettiProjection = this.progettoService.getProgettiByServizio(idServizio);
		schedaDettaglioServizioBean.setProgettiAssociatiAlServizio(progettiProjection);
		return schedaDettaglioServizioBean;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void eliminaServizio(@NotNull final Long idServizio) {
		final ServizioEntity servizioEntity = this.servizioSQLService.getServizioById(idServizio);
		
		// Verifico se posso eliminare il servizio
		final String statoServizio = servizioEntity.getStato();
		if(! this.isServizioEliminabile(statoServizio)) {
			final String messaggioErrore = String.format("Impossibile eliminare Servizio con id=%s. Stato Servizio = '%s'", idServizio, statoServizio);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S07);
		}
		// cancello tutte le tipologie servizio associate al servizio su MySql
//		this.tipologiaServizioRepository.deleteByIdServizio(idServizio);
		
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
}