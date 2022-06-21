package it.pa.repdgt.surveymgmt.service;

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

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
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
	

	public ServizioEntity getServizioById(@NotNull Long idServizio) {
		final String messaggioErrore = String.format("Servizio con id=%s non presente", idServizio);
		return this.servizioSqlRepository.findById(idServizio)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	/**
	 * Recupero tutti i servizi sulla base dei filtri in input
	 *  - criterioRicercaServizio - filtro della barra di ricerca nella sezione Servizi
	 *  - tipologieServizi   - tipologie servizio da filtrare scelti nella dropdown della sezione Servizi
	 *  - statiServizioFiltro - stati serivizio da filtrare scelto nella dropdwon nella sezione Servizi
	 *  
	 * */
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
	public List<ServizioEntity> getAllServiziByFacilitatoreOVolontarioAndFiltro(
			final String criterioRicercaServizio,
			@NotEmpty final List<String> idsProgrammaFiltro, 
			@NotEmpty final List<String> idsProgettoFiltro, 
			final List<String> tipologieServizi,
			final List<String> statiServizioFiltro,
			final String codiceFiscaleUtente ) {
		return this.servizioSqlRepository.findAllServiziByFacilitatoreOVolontarioAndFiltro(
				criterioRicercaServizio,
				idsProgrammaFiltro,
				idsProgettoFiltro,
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
	public List<ServizioEntity> getAllServiziByReferenteODelegatoEntePartnerAndFiltro(
			final String criterioRicercaServizio,
			@NotEmpty final List<String> idsProgrammaFiltro, 
			@NotEmpty final List<String> idsProgettoFiltro,
			final List<String> tipologieServizi,
			final List<String> statiServizioFiltro ) {
		return this.servizioSqlRepository.findAllServiziByReferenteODelegatoEntePartnerAndFiltro(
				criterioRicercaServizio,
				idsProgrammaFiltro,
				idsProgettoFiltro,
				tipologieServizi,
				statiServizioFiltro
			);
	}
	
	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity salvaServizio(
			@NotNull final ServizioRequest servizioRequest,
			@NotBlank final String idSezioneQ3Compilato ) {
		final ServizioEntity servizioEntity = this.creaServizio(servizioRequest, idSezioneQ3Compilato);
		return this.servizioSqlRepository.save(servizioEntity);
	}
	
	public ServizioEntity creaServizio(
			@NotNull final ServizioRequest servizioRequest,
			@NotNull final String idSezioneQ3Compilato) {
		final ProfilazioneParam profilazioneParam = servizioRequest.getProfilazioneParam();
		final Long idProgramma = profilazioneParam.getIdProgramma();
		
		// Recupero id template questionario associato al programma
		final List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario = this.programmaXQuestionarioTemplateService.getByIdProgramma(idProgramma);
		if( listaProgrammaXQuestionario.isEmpty() ) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Nessun questionario template associato al programma con id '%s'", idProgramma);
			throw new ServizioException(messaggioErrore);
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
		idEnteSedeProgettoFacilitatore.setIdFacilitatore(profilazioneParam.getCodiceFiscaleUtenteLoggato());
		final EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = this.enteSedeProgettoFacilitatoreService.getById(idEnteSedeProgettoFacilitatore);
		
		final ServizioEntity servizioEntity = new ServizioEntity();
		servizioEntity.setNome(servizioRequest.getNomeServizio());
		servizioEntity.setTipologiaServizio(servizioRequest.getTipologiaServizio());
		servizioEntity.setDataServizio(servizioRequest.getDataServizio());
		servizioEntity.setIdQuestionarioTemplateSnapshot(idQuestinarioTemplate);
		servizioEntity.setIdEnteSedeProgettoFacilitatore(enteSedeProgettoFacilitatore.getId());
		servizioEntity.setIdTemplateCompilatoQ3(idSezioneQ3Compilato);
		servizioEntity.setDataOraCreazione(new Date());
		servizioEntity.setDataOraAggiornamento(servizioEntity.getDataOraCreazione());
		servizioEntity.setStato(StatoEnum.NON_ATTIVO.getValue());
		return servizioEntity;
	}

	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity aggiornaServizio(
			@NotNull final Long idServizio, 
			@NotNull final @Valid ServizioRequest servizioDaAggiornareRequest) {
		final EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreAggiornato = new EnteSedeProgettoFacilitatoreKey(
			servizioDaAggiornareRequest.getIdEnte(),
			servizioDaAggiornareRequest.getIdSede(),
			servizioDaAggiornareRequest.getProfilazioneParam().getIdProgetto(),
			servizioDaAggiornareRequest.getProfilazioneParam().getCodiceFiscaleUtenteLoggato()
		);
		
		// Recupero servizio in MySql a partire dall'id e
		// aggiorno i dati sul servizio fetchato dal db
		final ServizioEntity servizioFecthDB = this.getServizioById(idServizio);
		servizioFecthDB.setNome(servizioDaAggiornareRequest.getNomeServizio());
		servizioFecthDB.setDataServizio(servizioDaAggiornareRequest.getDataServizio());
		servizioFecthDB.setTipologiaServizio(servizioDaAggiornareRequest.getTipologiaServizio());
		servizioFecthDB.setIdEnteSedeProgettoFacilitatore(enteSedeProgettoFacilitatoreAggiornato);
		servizioFecthDB.setDataOraAggiornamento(new Date());
		return this.servizioSqlRepository.save(servizioFecthDB);
	}
	
	public List<EnteProjection> getEntiByFacilitatore(ProfilazioneParam profilazioneParam) {
		return this.enteSedeProgettoFacilitatoreService.getEntiByFacilitatore(profilazioneParam);
	}

	public List<SedeProjection> getSediByFacilitatore(ProfilazioneParam profilazioneParam) {
		return this.enteSedeProgettoFacilitatoreService.getSediByFacilitatore(profilazioneParam);
	}

	public void cancellaServivio(@NotNull final ServizioEntity servizioEntity) {
		this.servizioSqlRepository.delete(servizioEntity);
	}
	
	public Optional<ServizioEntity> getPrimoServizioByIdCittadino(@NotNull Long idServizio, @NotNull Long idCittadino) {
		return this.servizioSqlRepository.findServizioByCittadinoNotEqual(idServizio, idCittadino);
	}
}