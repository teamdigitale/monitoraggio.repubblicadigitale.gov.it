package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.programmaprogetto.projection.UtenteFacilitatoreProjection;
import it.pa.repdgt.programmaprogetto.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;

@Service
@Validated
public class EnteSedeProgettoFacilitatoreService {
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaAssociazioneFacilitatoreOVolontarioAEnteSedeProgetto(
			@NotNull String codiceFiscaleUtente,
			@NotNull Long idSede, 
			@NotNull Long idEnte, 
			@NotNull Long idProgetto,
			@NotNull String codiceRuolo) {
		
		this.cancellaAssociazioneFacilitatoreOVolontario(idSede, idEnte, idProgetto, codiceFiscaleUtente, codiceRuolo);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgetto(
			@NotNull Long idSede, 
			@NotNull Long idEnte, 
			@NotNull Long idProgetto) {
		
		List<EnteSedeProgettoFacilitatoreEntity> facilitatoriEVolontari = this.getAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(idSede, idEnte, idProgetto);
		
		facilitatoriEVolontari.stream().forEach(facilitatoreOVolontario -> {
			this.cancellaAssociazioneFacilitatoreOVolontario(
					facilitatoreOVolontario.getId().getIdEnte(),
					facilitatoreOVolontario.getId().getIdSede(),
					facilitatoreOVolontario.getId().getIdProgetto(),
					facilitatoreOVolontario.getId().getIdFacilitatore(),
					facilitatoreOVolontario.getRuoloUtente());
		});
	}

	@LogMethod
	@LogExecutionTime
	public List<EnteSedeProgettoFacilitatoreEntity> getAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(Long idSede, Long idEnte, Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.findAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(idSede, idEnte, idProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteFacilitatoreProjection> getAllEmailFacilitatoriEVolontariByProgetto(Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.findAllEmailFacilitatoriEVolontariByProgetto(idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaAssociazioneFacilitatoreOVolontario(Long idEnte, Long idSede, Long idProgetto, String codiceFiscaleUtente, String codiceRuolo) {
		EnteSedeProgettoFacilitatoreKey id = new EnteSedeProgettoFacilitatoreKey(idEnte, idSede, idProgetto, codiceFiscaleUtente);
		this.enteSedeProgettoFacilitatoreRepository.deleteById(id);	
		
		//Controllo se l'utente è FAC o VOL(a seconda del codiceRuolo che mi viene passato) su altre ente sede progetto oltre a questo
		boolean unicaAssociazione = this.enteSedeProgettoFacilitatoreRepository.findAltreAssociazioni(idProgetto, codiceFiscaleUtente, codiceRuolo).isEmpty();
		
		/*Se la condizione sopra è vera allora insieme all'associazione del facilitatore o volontario a ente sede progetto
		 * cancellerò anche l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}
	
	@LogMethod
	@LogExecutionTime
	public void salvaEnteSedeProgettoFacilitatore(EnteSedeProgettoFacilitatoreEntity utente) {
		this.enteSedeProgettoFacilitatoreRepository.save(utente);
	}
}
