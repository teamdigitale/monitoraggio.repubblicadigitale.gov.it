package it.pa.repdgt.ente.service;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.exception.EnteSedeProgettoException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.EnteSedeProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class EnteSedeProgettoService {
	@Autowired
	private SedeService sedeService;
	@Autowired
	@Lazy
	private EnteService enteService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private EnteSedeProgettoRepository enteSedeProgettoRepository;
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	
	@LogMethod
	@LogExecutionTime
	public EnteSedeProgetto getAssociazioneEnteSedeProgetto(Long idSede, Long idEnte, Long idProgetto) {
		EnteSedeProgettoKey id = new EnteSedeProgettoKey(idEnte, idSede, idProgetto);
		String errorMessage = String.format("Associazione sede-ente-progetto non presente per sede con id=%s, ente con id=%s, progetto con id=%s",
				idSede, idEnte, idProgetto);
		return this.enteSedeProgettoRepository.findById(id)
					.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}

	/**
	 * Metodo di assegnazione di una Sede ad un determinato Ente 
	 * per un determinato Progetto
	 * 
	 * @param Long idSede 	   - identificativo della sede
	 * @param Long idEnte 	   - identificativo dell'ente
	 * @param String ruoloEnte - ruolo dell'ente sul progetto (GestoreDiProgetto, Partner)
	 * @param Long idProgetto  - identificativo del progetto
	 * 
	 * @throws EnteSedeProgettoException - Se almeno uno dei 3 domini non esiste nella base dati
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	public void associaEnteSedeProgetto(Long idSede, Long idEnte, String ruoloEnte, Long idProgetto) {
		SedeEntity sede = null;
		EnteEntity ente = null;
		ProgettoEntity progetto = null;
		try {
			sede = this.sedeService.getSedeById(idSede);
			ente = this.enteService.getEnteById(idEnte);
			progetto = this.progettoService.getProgettoById(idProgetto);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = "Impossibile associare ente-sede-progetto perchè uno dei 3 non esiste";
			throw new EnteSedeProgettoException(errorMessage, ex);
		}
		EnteSedeProgettoKey id = new EnteSedeProgettoKey(idEnte, idSede, idProgetto);
		EnteSedeProgetto enteSedeProgetto = new EnteSedeProgetto();
		enteSedeProgetto.setId(id);
		enteSedeProgetto.setEnte(ente);
		enteSedeProgetto.setRuoloEnte(ruoloEnte);
		enteSedeProgetto.setSede(sede);
		enteSedeProgetto.setProgetto(progetto);
		enteSedeProgetto.setDataOraCreazione(new Date());
		enteSedeProgetto.setDataOraAggiornamento(new Date());
 		enteSedeProgetto.setStatoSede(StatoEnum.NON_ATTIVO.getValue());
		this.enteSedeProgettoRepository.save(enteSedeProgetto);
	}
	
	/**
	 * Metodo di rimozione assegnazione di una Sede ad un determinato Ente 
	 * per un determinato Progetto
	 * 
	 * @param Long idSede 	   - identificativo della sede
	 * @param Long idEnte 	   - identificativo dell'ente
	 * @param Long idProgetto  - identificativo del progetto
	 * 
	 * @throws EnteSedeProgettoException - Se almeno uno dei 3 domini non esiste nella base dati
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaOTerminaAssociazioneEnteSedeProgetto(Long idEnte, Long idSede, Long idProgetto) {
//		 Possibile eseguire la disassociazione se almeno una delle condizioni seguenti è verificata:
//		 		1. Lo stato del progetto é NON_ATTIVO 
//		 		2. Lo stato del progetto è ATTIVO oppure ATTIVABILE
//					&& esiste almeno un'altra sede ATTIVA con almeno un facilitatore associato
		EnteSedeProgettoKey id = new EnteSedeProgettoKey(idEnte, idSede, idProgetto);
		EnteSedeProgetto enteSedeProgettoFetch = this.enteSedeProgettoRepository.findById(id).get();
		
		if(enteSedeProgettoFetch.getStatoSede().equals(StatoEnum.NON_ATTIVO.getValue())) {
			this.cancellazioneAssociazioneEnteSedeProgetto(idEnte, idSede, idProgetto);
			return;
		}
		if(!isEnteSedeProgettoDisassociabili(idEnte, idSede, idProgetto)) {
			throw new EnteSedeProgettoException("Impossibile cancellare associazione Ente-Sede-Progetto");
		}
		this.terminaAssociazioneEnteSedeProgetto(idEnte, idSede, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminaAssociazioneEnteSedeProgetto(Long idEnte, Long idSede, Long idProgetto) {
		EnteSedeProgettoKey enteSedeProgettoId = new EnteSedeProgettoKey(idEnte, idSede, idProgetto);
		if(!this.enteSedeProgettoRepository.existsById(enteSedeProgettoId)) {
			String errorMessage = String.format("Impossibile cancellare associazione Ente-Sede-Progetto. Associazione Ente-Sede-Progetto=%s-%s-%s non presente.", 
					idEnte, idSede, idProgetto);
			throw new EnteSedeProgettoException(errorMessage);
		}
		
		List<EnteSedeProgettoFacilitatoreEntity> facilitatori = this.enteSedeProgettoFacilitatoreService.getAllFacilitatoriByEnteAndSedeAndProgetto(idEnte, idSede, idProgetto);
		
		facilitatori
			.stream()
			.forEach(this.enteSedeProgettoFacilitatoreService::cancellaOTerminaAssociazioneFacilitatoreOVolontarioAEnteSedeProgetto);
		
		EnteSedeProgetto enteSedeProgettoDBFetch = this.getAssociazioneEnteSedeProgetto(idSede, idEnte, idProgetto);
		enteSedeProgettoDBFetch.setStatoSede(StatoEnum.TERMINATO.getValue());
		enteSedeProgettoDBFetch.setDataTerminazioneSede(new Date());
		this.salvaEnteSedeProgetto(enteSedeProgettoDBFetch);
	}

	private boolean isEnteSedeProgettoDisassociabili(Long idEnte, Long idSede, Long idProgetto) {
		String statoProgetto = this.progettoService.getStatoProgettoById(idProgetto);
		
		boolean isProgettoNonAttivo = StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoProgetto);
		
		boolean isProgettoAttivoOAttivabile = (   
												   StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoProgetto) 
										        || StatoEnum.ATTIVABILE.getValue().equalsIgnoreCase(statoProgetto)  
										     );
		
		// verifico se esistono altri facilitatore in altre sedi per quel determinato progetto, per quel determinato ente
		boolean esistonoFacilitatoriInAltreSedi = this.getNumeroAltreSediAttiveConFacilitatore(idEnte, idSede, idProgetto) > 0 ;
		
		return  isProgettoNonAttivo || (isProgettoAttivoOAttivabile && esistonoFacilitatoriInAltreSedi);
	}

	private int getNumeroAltreSediAttiveConFacilitatore(Long idEnte, Long idSede, Long idProgetto) {
		String associazioneEnteSedeProgetto = String.format("%s-%s-%s", idEnte, idSede, idProgetto);
		return this.enteSedeProgettoRepository.findAltreSediAttiveConFacilitatore(idProgetto, associazioneEnteSedeProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellazioneAssociazioneEnteSedeProgetto(Long idEnte, Long idSede, Long idProgetto) {
		EnteSedeProgettoKey enteSedeProgettoId = new EnteSedeProgettoKey(idEnte, idSede, idProgetto);
		if(!this.enteSedeProgettoRepository.existsById(enteSedeProgettoId)) {
			String errorMessage = String.format("Impossibile cancellare associazione Ente-Sede-Progetto. Associazione Ente-Sede-Progetto=%s-%s-%s non presente.", 
					idEnte, idSede, idProgetto);
			throw new EnteSedeProgettoException(errorMessage);
		}
		this.enteSedeProgettoFacilitatoreService.cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgetto(idSede, idEnte, idProgetto);
		EnteSedeProgetto enteSedeProgettoDBFetch = this.getAssociazioneEnteSedeProgetto(idSede, idEnte, idProgetto);
		this.enteSedeProgettoRepository.delete(enteSedeProgettoDBFetch);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgetto(Long idEnte, Long idProgetto) {
		this.enteSedeProgettoRepository.cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgetto(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public List<EnteSedeProgetto> getSediPerProgettoAndEnte(Long idEnte, Long idProgetto) {
		return this.enteSedeProgettoRepository.findSediPerProgettoAndEnte(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public void salvaEnteSedeProgetto(EnteSedeProgetto sede) {
		this.enteSedeProgettoRepository.save(sede);
	}
}