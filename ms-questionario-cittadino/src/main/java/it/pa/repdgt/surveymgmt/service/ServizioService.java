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

import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.surveymgmt.bean.DettaglioServizioBean;
import it.pa.repdgt.surveymgmt.bean.SchedaDettaglioServizioBean;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.ServizioMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.param.FiltroListaServiziParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;
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
	private ServizioSqlService servizioSQLService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private EnteService enteService;
	@Autowired
	private SedeService sedeService;
	
	/**
	 * Recupera l'elenco dei servizi paginati sulla base della profilazione dell'utente loggato e dei filtri in input
	 * - ProfilazioneParama - contiene i dati della profilazione dell'utente loggato 
	 * - FiltroListaServiziParam - contiene tutti i filtri da applicare all'elenco dei servizi
	 * 
	 * */
	public Page<ServizioEntity> getAllServiziPaginatiByProfilazioneAndFiltri(
			@NotNull @Valid final ProfilazioneParam profilazione,
			@NotNull @Valid final FiltroListaServiziParam filtroListaServizi,
			@NotNull final Pageable pagina ) {
		// Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato alla piattaforma
		final String codiceFiscaleUtenteLoggato = profilazione.getCodiceFiscaleUtenteLoggato().trim().toUpperCase();
		final String codiceRuoloUtenteLoggato   = profilazione.getCodiceRuoloUtenteLoggato().toString().trim().toUpperCase();
		
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		if( !this.utenteService.hasRuoloUtente(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new ServizioException(messaggioErrore);
		}
		
		// Recupero tutti i Servizi in base al ruolo profilato dell'utente loggato e in base ai filtri selezionati
		final List<ServizioEntity> listaServizi = this.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(profilazione, filtroListaServizi);
		
		// Effettuo la paginazione della lista dei servizi recuperati in precedenza
		int start = (int) pagina.getOffset();
		int end = Math.min((start + pagina.getPageSize()), listaServizi.size());
		if(start > end) {
			throw new ServizioException("ERRORE: pagina richiesta inesistente");
		}
		return new PageImpl<ServizioEntity>(listaServizi.subList(start, end), pagina, listaServizi.size());
	}
	
	/**
	 * Recupera l'elenco dei servizi sulla base della profilazione dell'utente loggato e dei filtri in input
	 * - ProfilazioneParama - contiene i dati della profilazione dell'utente loggato 
	 * - FiltroListaServiziParam - contiene tutti i filtri da applicare all'elenco dei servizi
	 * 
	 * */
	public List<ServizioEntity> getAllServiziByProfilazioneUtenteLoggatoAndFiltri(
			@NotNull @Valid ProfilazioneParam profilazione,
			@NotNull @Valid FiltroListaServiziParam filtroListaServizi) {
		// Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato alla piattaforma
		final String codiceFiscaleUtenteLoggato = profilazione.getCodiceFiscaleUtenteLoggato().trim().toUpperCase();
		final String codiceRuoloUtenteLoggato   = profilazione.getCodiceRuoloUtenteLoggato().toString().trim().toUpperCase();
		
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		if( !this.utenteService.hasRuoloUtente(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new ServizioException(messaggioErrore);
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

			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore Progetto
			case RuoliUtentiConstants.REPP:
			case RuoliUtentiConstants.DEPP:
				return this.servizioSQLService.getAllServiziByReferenteODelegatoEntePartnerAndFiltro(
						filtroListaServizi.getCriterioRicerca(),
						Arrays.asList( profilazione.getIdProgramma().toString() ),
						Arrays.asList( profilazione.getIdProgetto().toString() ),
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					);
				
			// Se: Utente loggato si è profilato con ruolo Referente/Delegato Ente Gestore Partner
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

	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity creaServizio(
			@NotNull final ServizioRequest servizioRequest) {
		final String codiceFiscaletenteLoggato = servizioRequest.getProfilazioneParam().getCodiceFiscaleUtenteLoggato();
		final String ruoloUtenteLoggato = servizioRequest.getProfilazioneParam().getCodiceRuoloUtenteLoggato().toString();
		
		if( ! this.utenteService.isUtenteFacilitatore(codiceFiscaletenteLoggato, ruoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Utente con codice fiscale '%s' non ha ruolo FACILITATORE", codiceFiscaletenteLoggato);
			throw new ServizioException(messaggioErrore);
		}
		
		// creo SezioneQ3Mongo
		final SezioneQ3Collection sezioneQ3Compilato = this.creaSezioneQ3(servizioRequest);
		
		// salvo servizio su MySql
		ServizioEntity servizioCreato = this.servizioSQLService.salvaServizio(servizioRequest, sezioneQ3Compilato.getId());
		
		// salvo SezioneQ3Compilato su MongoDB
		this.sezioneQ3Repository.save(sezioneQ3Compilato);
		
		return servizioCreato;
	}
	
	public SezioneQ3Collection creaSezioneQ3(@NotNull final ServizioRequest servizioRequest) {
		final SezioneQ3Collection sezioneQ3Collection = this.servizioMapper.toCollectionFrom(servizioRequest);
		sezioneQ3Collection.setId(UUID.randomUUID().toString());
		sezioneQ3Collection.setDataOraCreazione(new Date());
		sezioneQ3Collection.setDataOraUltimoAggiornamento(sezioneQ3Collection.getDataOraCreazione());
		return sezioneQ3Collection;
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void aggiornaServizio(
			@NotNull Long idServizioDaAggiornare, 
			@NotNull @Valid ServizioRequest servizioDaAggiornareRequest) {
		final String codiceFiscaletenteLoggato = servizioDaAggiornareRequest.getProfilazioneParam().getCodiceFiscaleUtenteLoggato();
		final String ruoloUtenteLoggato = servizioDaAggiornareRequest.getProfilazioneParam().getCodiceRuoloUtenteLoggato().toString();
		
		if( !this.utenteService.isUtenteFacilitatore(codiceFiscaletenteLoggato, ruoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Impossibile aggiornare servizio. Utente con codice fiscale '%s' non ha ruolo FACILITATORE", codiceFiscaletenteLoggato);
			throw new ServizioException(messaggioErrore);
		}
		
		// Aggiorno servizio su MySql
		final ServizioEntity servizioAggiornato = this.servizioSQLService.aggiornaServizio(idServizioDaAggiornare, servizioDaAggiornareRequest);

		// Recupero SezioneQ3Compilato
		final String idSezioneQ3Compilato = servizioAggiornato.getIdTemplateCompilatoQ3();
		final SezioneQ3Collection sezioneQ3Compilato = this.sezioneQ3Repository
				.findById(idSezioneQ3Compilato)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("SezioneQ3Compilato con id=%s non presente", idSezioneQ3Compilato)));

		// Cancello SezioneQ3Mongo su MongoDB e lo risalvo con i valori aggiornati
		this.sezioneQ3Repository.deleteByIdSezioneQ3(sezioneQ3Compilato.getId());
		
		// Salvo SezioneQ3Compilato con i dati da aggiornare su MongoDB
		final SezioneQ3Collection sezioneQ3DaAggiornare = this.servizioMapper.toCollectionFrom(servizioDaAggiornareRequest);
		sezioneQ3DaAggiornare.setMongoId(sezioneQ3Compilato.getMongoId());
		sezioneQ3DaAggiornare.setId(sezioneQ3Compilato.getId());
		sezioneQ3DaAggiornare.setDataOraCreazione(sezioneQ3Compilato.getDataOraCreazione());
		sezioneQ3DaAggiornare.setDataOraUltimoAggiornamento(new Date());
		this.sezioneQ3Repository.save(sezioneQ3DaAggiornare);
	}

	/**
	 * Recupera tutte le 'tipologie di servizio' associati ai servizi dell'utente che si è loggato
	 * con un determinato profilo
	 * 
	 * */
	public List<String> getAllTipologiaServizioFiltroDropdown(
			@NotNull @Valid final ProfilazioneParam profilazione, 
			@NotNull @Valid final FiltroListaServiziParam filtroListaServizi) {
		return this.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(profilazione, filtroListaServizi)
				.stream()
				.map(ServizioEntity::getTipologiaServizio)
				.distinct()
				.collect(Collectors.toList());
	}

	/**
	 * Recupera tutti gli stati servizi relativi all'utente che si è loggato
	 * con un determinato profilo
	 * 
	 * */
	public List<String> getAllStatiServizioFiltroDropdown(
			@NotNull @Valid final ProfilazioneParam profilazione, 
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
	public SchedaDettaglioServizioBean getSchedaDettaglioServizio(@NotNull final Long idServizio) {
		final ServizioEntity servizioEntity = this.servizioSQLService.getServizioById(idServizio);
		final EnteEntity enteEntity = this.enteService.getById(servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdEnte());
		final SedeEntity sedeEntity = this.sedeService.getById(servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdSede());
		
		final SchedaDettaglioServizioBean schedaDettaglioServizioBean = new SchedaDettaglioServizioBean();
		final DettaglioServizioBean dettaglioServizioBean = new DettaglioServizioBean();
		dettaglioServizioBean.setNomeServizio(servizioEntity.getNome());
		dettaglioServizioBean.setNomeEnte(enteEntity.getNome());
		dettaglioServizioBean.setNomeSede(sedeEntity.getNome());
		dettaglioServizioBean.setTipologiaServizio(servizioEntity.getTipologiaServizio());
		
		final Optional<SezioneQ3Collection> sezioneQ3Compilato = this.sezioneQ3Repository.findById(servizioEntity.getIdTemplateCompilatoQ3());
		dettaglioServizioBean.setSezioneQ3compilato(sezioneQ3Compilato.orElse(null));
		
		schedaDettaglioServizioBean.setDettaglioServizio(dettaglioServizioBean);
		
		final List<ProgettoProjection> progettiProjection = this.progettoService.getProgettiByServizio(idServizio);
		schedaDettaglioServizioBean.setProgettiAssociatiAlServizio(progettiProjection);
		return schedaDettaglioServizioBean;
	}

	@Transactional(rollbackOn = Exception.class)
	public void eliminaServizio(@NotNull final Long idServizio) {
		final ServizioEntity servizioEntity = this.servizioSQLService.getServizioById(idServizio);
		
		// Verifico se posso eliminare il servizio
		final String statoServizio = servizioEntity.getStato();
		if(! this.isServizioEliminabile(statoServizio)) {
			final String messaggioErrore = String.format("Impossibile eliminare Servizio con id=%s. Stato Servizio = '%s'", idServizio, statoServizio);
			throw new ServizioException(messaggioErrore);
		}
		
		// cancello servizio su MySql
		this.servizioSQLService.cancellaServivio(servizioEntity);
		
		// cancello SezioneQ3Compilato su MongoDB
		this.sezioneQ3Repository.deleteByIdSezioneQ3(servizioEntity.getIdTemplateCompilatoQ3());
	}
	
	public boolean isServizioEliminabile(@NotNull final String statoServizio) {
		return StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoServizio);
	}
}