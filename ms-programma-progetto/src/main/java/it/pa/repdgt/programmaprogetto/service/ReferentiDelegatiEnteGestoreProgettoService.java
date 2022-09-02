package it.pa.repdgt.programmaprogetto.service;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class ReferentiDelegatiEnteGestoreProgettoService {
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	@Lazy
	private ProgettoService progettoService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaReferentiDelegatiProgetto(Long idProgetto) {
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegati = this.referentiDelegatiEnteGestoreProgettoRepository.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(idProgetto);
		
		referentiDelegati.stream().forEach(this::cancellaAssociazioneReferenteODelegatoGestoreProgetto);
	}
	
	/**
	 * Cancella associazione Utente Referente o utente delegato all'ente gestore di progetto
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
    public void cancellaAssociazioneReferenteODelegatoGestoreProgetto(ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgetto) {
		Long idProgetto = referentiDelegatiEnteGestoreProgetto.getId().getIdProgetto();
		String codiceFiscaleUtente = referentiDelegatiEnteGestoreProgetto.getId().getCodFiscaleUtente();
		String codiceRuolo  = referentiDelegatiEnteGestoreProgetto.getCodiceRuolo().toUpperCase();
		Long idEnte = referentiDelegatiEnteGestoreProgetto.getId().getIdEnte();
		ReferentiDelegatiEnteGestoreProgettoKey id =  new ReferentiDelegatiEnteGestoreProgettoKey(idProgetto, codiceFiscaleUtente, idEnte);
		this.referentiDelegatiEnteGestoreProgettoRepository.deleteById(id);
		
		//Controllo se l'utente è REGP o DEGP(a seconda del codiceRuolo che mi viene passato) su altri gestori progetto oltre a questo
		boolean unicaAssociazione = this.referentiDelegatiEnteGestoreProgettoRepository.findAltreAssociazioni(idProgetto, codiceFiscaleUtente, codiceRuolo).isEmpty();
		
		/*Se la condizione sopra è vera allora insieme all'associazione del referente/delegato al gestore progetto
		 * cancellerò anche l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}

	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEnteGestoreProgettoEntity> getReferentiEDelegatiProgetto(Long idProgetto) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findReferentiEDelegatiProgetto(idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaOTerminaAssociazioneReferenteDelegatoProgetto(ReferentiDelegatiEnteGestoreProgettoEntity utente) {
		if(utente.getStatoUtente().equals(StatoEnum.ATTIVO.getValue())) {
			utente.setStatoUtente(StatoEnum.TERMINATO.getValue());
			utente.setDataOraTerminazione(new Date());
			this.referentiDelegatiEnteGestoreProgettoRepository.save(utente);
		}
		if(utente.getStatoUtente().equals(StatoEnum.NON_ATTIVO.getValue())) {
			this.cancellaAssociazioneReferenteODelegatoGestoreProgetto(utente);
		}
	}
}