package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.TipologiaServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParamLightProgramma;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.repository.TipologiaServizioRepository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;

@Service
@Validated
public class ServizioSqlService {
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	@Autowired
	private ServizioSqlRepository servizioSqlRepository;
	@Autowired
	private TipologiaServizioRepository tipologiaServizioRepository;
	@Autowired
	private RuoloService ruoloService;
	
	@LogMethod
	@LogExecutionTime
	public ServizioEntity getServizioById(@NotNull Long idServizio) {
		final String messaggioErrore = String.format("Servizio con id=%s non presente", idServizio);
		return this.servizioSqlRepository.findById(idServizio)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
	
	/**
	 * Recupero tutti i servizi sulla base dei filtri in input
	 *  - criterioRicercaServizio - filtro della barra di ricerca nella sezione Servizi
	 *  - tipologieServizi   - tipologie servizio da filtrare scelti nella dropdown della sezione Servizi
	 *  - statiServizioFiltro - stati serivizio da filtrare scelto nella dropdwon nella sezione Servizi
	 *  
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByFiltro(
			final String criterioRicercaServizio, 
			final List<String> tipologieServizi,
			final List<String> statiServizioFiltro) {
		return this.servizioSqlRepository.findAllServiziByFiltro(
				criterioRicercaServizio,
				tipologieServizi,
				statiServizioFiltro
			);
	}

	/**
	 * Recupero solo i servizi associati a programmi con policy SCD sulla base dei filtri in input
	 *  - criterioRicercaServizio - filtro della barra di ricerca nella sezione Servizi
	 *  - tipologieServizi   - tipologie servizio da filtrare scelti nella dropdown della sezione Servizi
	 *  - statiServizioFiltro - stati serivizio da filtrare scelto nella dropdwon nella sezione Servizi
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByPolicySCDAndFiltro(
			final String criterioRicercaServizio,
			final List<String> tipologieServizi, 
			final List<String> statiServizioFiltro) {
		return this.servizioSqlRepository.findAllServiziByPolicySCDAndFiltro(
				criterioRicercaServizio,
				tipologieServizi,
				statiServizioFiltro
			);
	}
	
	/**
	 * Recupero solo i servizi dell'utente profilatosi come facilitatore/volontario sulla base dei filtri in input
	 *  - criterioRicercaServizio - filtro della barra di ricerca nella sezione Servizi
	 *  - statiServizioFiltro - stati serivizio da filtrare scelto nella dropdwon nella sezione Servizi
 	 *  - tipologieServizi   - tipologie servizio da filtrare scelti nella dropdown della sezione Servizi
	 * Nota:
	 * 	- idsProgrammaFiltro - conterrà l'unico programma con cui l'utente facilitatore si è profilato
	 *  - idsProgettoFiltro  - conterrà l'unico progetto  con cui l'utente facilitatore si è profilato
	 *  
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByFacilitatoreOVolontarioAndFiltro(
			final String criterioRicercaServizio,
			@NotEmpty final List<String> idsProgrammaFiltro, 
			@NotEmpty final List<String> idsProgettoFiltro, 
			final Long idEnte,
			final List<String> tipologieServizi,
			final List<String> statiServizioFiltro,
			final String codiceFiscaleUtente ) {
		return this.servizioSqlRepository.findAllServiziByFacilitatoreOVolontarioAndFiltro(
				criterioRicercaServizio,
				idsProgrammaFiltro,
				idsProgettoFiltro,
				idEnte,
				tipologieServizi,
				statiServizioFiltro,
				codiceFiscaleUtente
			);
	}

	/**
	 * Recupero solo i servizi dell'utente profilatosi come Referente/Delegato dell' ente getsore di programma sulla base dei filtri in input
	 *  - criterioRicercaServizio - filtro della barra di ricerca nella sezione Servizi
	 *  - tipologieServizi   - tipologie servizio da filtrare scelti nella dropdown della sezione Servizi
	 *  - statiServizioFiltro - stati serivizio da filtrare scelto nella dropdwon nella sezione Servizi
	 *  
	 * Nota:
	 * 	- idsProgrammaFiltro - conterrà l'unico programma con cui l'utente referente/delegato dell'ente gestore di programma si è profilato
	 *  
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
			final String criterioRicercaServizio,
			@NotEmpty final List<String> idsProgrammaFiltro, 
			final List<String> tipologieServizi,
			final List<String> statiServizioFiltro ) {
		return this.servizioSqlRepository.findAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
				criterioRicercaServizio,
				idsProgrammaFiltro,
				tipologieServizi,
				statiServizioFiltro
			);
	}
	
	/**
	 * Recupero solo i servizi dell'utente profilatosi come Referente/Delegato dell'ente gestore di progetto sulla base dei filtri in input
	 *  - criterioRicercaServizio - filtro della barra di ricerca nella sezione Servizi
	 *  - tipologieServizi   - tipologie servizio da filtrare scelti nella dropdown della sezione Servizi
	 *  - statiServizioFiltro - stati serivizio da filtrare scelto nella dropdwon nella sezione Servizi
	 *  
	 * Nota:
	 * 	- idsProgrammaFiltro - conterrà l'unico programma con cui l'utente referente/delegato dell'ente gestore di progetto si è profilato
	 *  - idsProgettoFiltro  - conterrà l'unico progetto  con cui l'utente referente/delegato dell'ente gestore di progetto si è profilato
	 *  
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
			final String criterioRicercaServizio,
			@NotEmpty final List<String> idsProgrammaFiltro, 
			@NotEmpty final List<String> idsProgettoFiltro, 
			final List<String> tipologieServizi,
			final List<String> statiServizioFiltro ) {
		return this.servizioSqlRepository.findAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
				criterioRicercaServizio,
				idsProgrammaFiltro,
				idsProgettoFiltro,
				tipologieServizi,
				statiServizioFiltro
			);
	}

	/**
	 * Recupero solo i servizi dell'utente profilatosi come Referente/Delegato ente partner dell'ente gestore di progetto sulla base dei filtri in input
	 *  - criterioRicercaServizio - filtro della barra di ricerca nella sezione Servizi
	 *  - tipologieServizi   - tipologie servizio da filtrare scelti nella dropdown della sezione Servizi
	 *  - statiServizioFiltro - stati serivizio da filtrare scelto nella dropdwon nella sezione Servizi
	 *  
	 * Nota:
	 * 	- idsProgrammaFiltro - conterrà l'unico programma con cui l'utente referente/delegato dell'ente partner si è profilato
	 *  - idsProgettoFiltro  - conterrà l'unico progetto  con cui l'utente referente/delegato dell'ente partner si è profilato
	 *  
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ServizioEntity> getAllServiziByReferenteODelegatoEntePartnerAndFiltro(
			final String criterioRicercaServizio,
			@NotEmpty final List<String> idsProgrammaFiltro, 
			@NotEmpty final List<String> idsProgettoFiltro,
			final Long idEnte,
			final List<String> tipologieServizi,
			final List<String> statiServizioFiltro ) {
		return this.servizioSqlRepository.findAllServiziByReferenteODelegatoEntePartnerAndFiltro(
				criterioRicercaServizio,
				idsProgrammaFiltro,
				idsProgettoFiltro,
				idEnte,
				tipologieServizi,
				statiServizioFiltro
			);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity salvaServizio(
			@NotNull final ServizioRequest servizioRequest,
			@NotBlank final String idSezioneQ3Compilato ) {
		final ServizioEntity servizioEntity = this.creaServizio(servizioRequest, idSezioneQ3Compilato);
		return this.servizioSqlRepository.save(servizioEntity);
	}
	
	@LogMethod
	@LogExecutionTime
	public ServizioEntity creaServizio(
			@NotNull final ServizioRequest servizioRequest,
			@NotNull final String idSezioneQ3Compilato) {
		final SceltaProfiloParamLightProgramma profilazioneParam = servizioRequest.getProfilazioneParam();
		final Long idProgramma = profilazioneParam.getIdProgramma();
		
		// Recupero id template questionario associato al programma
		final List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario = this.programmaXQuestionarioTemplateService.getByIdProgramma(idProgramma);
		if( listaProgrammaXQuestionario.isEmpty() ) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Nessun questionario template associato al programma con id '%s'", idProgramma);
			throw new ServizioException(messaggioErrore, CodiceErroreEnum.S04);
		}
		
		final String idQuestinarioTemplate = listaProgrammaXQuestionario
																	.get(0)
																	.getProgrammaXQuestionarioTemplateKey()
																	.getIdQuestionarioTemplate();
		
		// Recupero ESP_FACILITATORE
		final EnteSedeProgettoFacilitatoreKey idEnteSedeProgettoFacilitatore = new EnteSedeProgettoFacilitatoreKey();
		idEnteSedeProgettoFacilitatore.setIdEnte(servizioRequest.getIdEnte());
		idEnteSedeProgettoFacilitatore.setIdSede(servizioRequest.getIdSede());
		idEnteSedeProgettoFacilitatore.setIdProgetto(profilazioneParam.getIdProgetto());
		idEnteSedeProgettoFacilitatore.setIdFacilitatore(servizioRequest.getCfUtenteLoggato());
		final EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = this.enteSedeProgettoFacilitatoreService.getById(idEnteSedeProgettoFacilitatore);
		
		final ServizioEntity servizioEntity = new ServizioEntity();
		servizioEntity.setNome(servizioRequest.getNomeServizio());
		servizioEntity.setDataServizio(servizioRequest.getDataServizio());
		servizioEntity.setDurataServizio(servizioRequest.getDurataServizio());
		servizioEntity.setIdQuestionarioTemplateSnapshot(idQuestinarioTemplate);
		servizioEntity.setIdEnteSedeProgettoFacilitatore(enteSedeProgettoFacilitatore.getId());
		servizioEntity.setIdTemplateCompilatoQ3(idSezioneQ3Compilato);
		servizioEntity.setDataOraCreazione(new Date());
		servizioEntity.setDataOraAggiornamento(servizioEntity.getDataOraCreazione());
		servizioEntity.setStato(StatoEnum.NON_ATTIVO.getValue());
		servizioEntity.setTipologiaServizio(String.join(", ", servizioRequest.getListaTipologiaServizi()));
		
		final List<String> listaTitoloTipologiaServizi = servizioRequest.getListaTipologiaServizi();
		
		final List<TipologiaServizioEntity> listaTipologiaServizi = new ArrayList<>();
		listaTitoloTipologiaServizi
			.stream()
			.forEach(titoloTiplogiaServizio -> {
				TipologiaServizioEntity tipologiaServizio = new TipologiaServizioEntity();
				tipologiaServizio.setTitolo(titoloTiplogiaServizio);
				tipologiaServizio.setDataOraCreazione(new Date());
				tipologiaServizio.setServizio(servizioEntity);
				listaTipologiaServizi.add(tipologiaServizio);
			});
		servizioEntity.setListaTipologiaServizi(listaTipologiaServizi);
		return servizioEntity;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity aggiornaServizio(
			@NotNull final Long idServizio, 
			@NotNull final @Valid ServizioRequest servizioDaAggiornareRequest) {
		final EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreAggiornato = new EnteSedeProgettoFacilitatoreKey(
			servizioDaAggiornareRequest.getIdEnte(),
			servizioDaAggiornareRequest.getIdSede(),
			servizioDaAggiornareRequest.getProfilazioneParam().getIdProgetto(),
			servizioDaAggiornareRequest.getCfUtenteLoggato()
		);
		
		this.enteSedeProgettoFacilitatoreService.getById(enteSedeProgettoFacilitatoreAggiornato);

		// Recupero servizio in MySql a partire dall'id e
		// aggiorno i dati sul servizio fetchato dal db
		final ServizioEntity servizioFecthDB = this.getServizioById(idServizio);
		servizioFecthDB.setNome(servizioDaAggiornareRequest.getNomeServizio());
		servizioFecthDB.setDataServizio(servizioDaAggiornareRequest.getDataServizio());
		
		final List<String> listaTitoloTipologiaServizi = servizioDaAggiornareRequest.getListaTipologiaServizi();
		
		final List<TipologiaServizioEntity> listaTipologiaServizi = new ArrayList<>();
		listaTitoloTipologiaServizi
			.stream()
			.forEach(titoloTipologiaServizio -> {
				TipologiaServizioEntity tipologiaServizio = new TipologiaServizioEntity();
				tipologiaServizio.setTitolo(titoloTipologiaServizio);
				if(this.tipologiaServizioRepository.findByTitoloAndServizioId(titoloTipologiaServizio, idServizio).isPresent()) {
					TipologiaServizioEntity tipologiaServizioFetchDb = this.tipologiaServizioRepository.findByTitoloAndServizioId(titoloTipologiaServizio, idServizio).get();
					tipologiaServizio.setDataOraCreazione(tipologiaServizioFetchDb.getDataOraCreazione());
				}else {
					tipologiaServizio.setDataOraCreazione(new Date());
				}
				tipologiaServizio.setDataOraAggiornamento(new Date());
				tipologiaServizio.setServizio(servizioFecthDB);
				listaTipologiaServizi.add(tipologiaServizio);
			});

		this.tipologiaServizioRepository.deleteByIdServizio(idServizio);
		
		servizioFecthDB.setListaTipologiaServizi(listaTipologiaServizi);
		servizioFecthDB.setIdEnteSedeProgettoFacilitatore(enteSedeProgettoFacilitatoreAggiornato);
		servizioFecthDB.setDataOraAggiornamento(new Date());
		servizioFecthDB.setTipologiaServizio(String.join(", ", servizioDaAggiornareRequest.getListaTipologiaServizi()));
		return this.servizioSqlRepository.save(servizioFecthDB);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<EnteProjection> getEntiByFacilitatore(SceltaProfiloParam profilazioneParam) {
		final String codiceFiscaleUtenteLoggato = profilazioneParam.getCfUtenteLoggato();
		final String codiceRuoloUtenteLoggato = profilazioneParam.getCodiceRuoloUtenteLoggato().toString();
		
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(codiceFiscaleUtenteLoggato)
			.stream()
			.anyMatch(ruolo -> codiceRuoloUtenteLoggato.equalsIgnoreCase(ruolo.getCodice()));
		
		if(!hasRuoloUtente 
				|| (!codiceRuoloUtenteLoggato.equalsIgnoreCase(RuoliUtentiConstants.FACILITATORE) &&
					!codiceRuoloUtenteLoggato.equalsIgnoreCase(RuoliUtentiConstants.VOLONTARIO) )) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'.\nOppure l'utente non è un FACILITATORE/VOLONTARIO",
					codiceFiscaleUtenteLoggato);
			throw new QuestionarioTemplateException(messaggioErrore, CodiceErroreEnum.U06);
		}
		
		return this.enteSedeProgettoFacilitatoreService.getEntiByFacilitatore(profilazioneParam);
	}

	@LogMethod
	@LogExecutionTime
	public List<SedeProjection> getSediByFacilitatore(SceltaProfiloParam profilazioneParam) {
		final String codiceFiscaleUtenteLoggato = profilazioneParam.getCfUtenteLoggato();
		final String codiceRuoloUtenteLoggato = profilazioneParam.getCodiceRuoloUtenteLoggato().toString();
		
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(codiceFiscaleUtenteLoggato)
			.stream()
			.anyMatch(ruolo -> codiceRuoloUtenteLoggato.equalsIgnoreCase(ruolo.getCodice()));

		if(!hasRuoloUtente 
				|| (!codiceRuoloUtenteLoggato.equalsIgnoreCase(RuoliUtentiConstants.FACILITATORE) &&
					!codiceRuoloUtenteLoggato.equalsIgnoreCase(RuoliUtentiConstants.VOLONTARIO) )) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'.\nOppure l'utente non è un FACILITATORE/VOLONTARIO",
					codiceFiscaleUtenteLoggato);
			throw new QuestionarioTemplateException(messaggioErrore, CodiceErroreEnum.U06);
		}
		
		return this.enteSedeProgettoFacilitatoreService.getSediByFacilitatore(profilazioneParam);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaServivio(@NotNull final ServizioEntity servizioEntity) {
		this.servizioSqlRepository.delete(servizioEntity);
	}
	
	@LogMethod
	@LogExecutionTime
	public Optional<ServizioEntity> getPrimoServizioByIdCittadino(@NotNull Long idServizio, @NotNull Long idCittadino) {
		return this.servizioSqlRepository.findServizioByCittadinoNotEqual(idServizio, idCittadino);
	}

	@LogMethod
	@LogExecutionTime
	public String getNominativoFacilitatoreByIdFacilitatoreAndIdServizio(String idFacilitatore, Long idServizio) {
		return this.servizioSqlRepository.findNominativoFacilitatoreByIdFacilitatoreAndIdServizio(idFacilitatore, idServizio);
	}

	public Optional<ServizioEntity> getServizioByNome(String nomeServizio) {
		return this.servizioSqlRepository.findByNome(nomeServizio);
	}
	
	public Optional<ServizioEntity> getServizioByNomeUpdate(String nomeServizio, Long idServizio) {
		return this.servizioSqlRepository.findByNomeUpdate(nomeServizio, idServizio);
	}

	public List<String> getIdsSediFacilitatoreConServiziAndCittadiniCensitiByCodFiscaleAndIdProgettoAndIdEnte(
			String codiceFiscaleUtenteLoggato, Long idProgetto, Long idEnte) {
		return servizioSqlRepository.findIdsSediFacilitatoreConServiziAndCittadiniCensitiByCodFiscaleAndIdProgettoAndIdEnte(codiceFiscaleUtenteLoggato, idProgetto, idEnte);
	}

	public int isServizioAssociatoAUtenteProgettoEnte(@NotNull Long idServizio, Long idProgetto, Long idEnte,
			@NotNull String cfUtenteLoggato) {
		return servizioSqlRepository.isServizioAssociatoAUtenteProgettoEnte(idServizio, idProgetto, idEnte, cfUtenteLoggato);
	}
	
	public int isServizioAssociatoARegpDegp(@NotNull Long idServizio, Long idProgetto) {
		return servizioSqlRepository.isServizioAssociatoARegpDegp(idServizio, idProgetto);
	}
	
	public int isServizioAssociatoAReppDepp(@NotNull Long idServizio, Long idProgetto, Long idEnte) {
		return servizioSqlRepository.isServizioAssociatoAReppDepp(idServizio, idProgetto, idEnte);
	}
}