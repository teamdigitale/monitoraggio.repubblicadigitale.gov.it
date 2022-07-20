package it.pa.repdgt.programmaprogetto.service;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class ReferentiDelegatiEnteGestoreProgrammaService {
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	@Lazy
	private ProgrammaService programmaService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgrammaRepository referentiDelegatiEnteGestoreProgrammaRepository;
	
	@Transactional(rollbackOn = Exception.class)
	public void cancellaReferentiDelegatiProgramma(Long idProgramma) {
		List<ReferentiDelegatiEnteGestoreProgrammaEntity> referentiDelegati = this.referentiDelegatiEnteGestoreProgrammaRepository.getReferentiDelegatiEnteGestoreProgrammaByIdProgramma(idProgramma);
		
		referentiDelegati.stream().forEach(this::cancellaAssociazioneReferenteODelegatoGestoreProgramma);
	}
	
	/**
	 * Cancella associazione Utente Referente o utente delegato all'ente gestore di programma
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
    public void cancellaAssociazioneReferenteODelegatoGestoreProgramma(ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgramma) {
		Long idProgramma = referentiDelegatiEnteGestoreProgramma.getId().getIdProgramma();
		String codiceFiscaleUtente = referentiDelegatiEnteGestoreProgramma.getId().getCodFiscaleUtente();
		String codiceRuolo  = referentiDelegatiEnteGestoreProgramma.getCodiceRuolo().toUpperCase();
		Long idEnte = referentiDelegatiEnteGestoreProgramma.getId().getIdEnte();
		ReferentiDelegatiEnteGestoreProgrammaKey id =  new ReferentiDelegatiEnteGestoreProgrammaKey(idProgramma, codiceFiscaleUtente, idEnte);
		
		this.referentiDelegatiEnteGestoreProgrammaRepository.deleteById(id);
		
		//Controllo se l'utente è REG o DEG(a seconda del codiceRuolo che mi viene passato) su altri gestori programma oltre a questo
		boolean unicaAssociazione = this.referentiDelegatiEnteGestoreProgrammaRepository.findAltreAssociazioni(idProgramma, codiceFiscaleUtente, codiceRuolo).isEmpty();
		
		/*Se la condizione sopra è vera allora insieme all'associazione del referente/delegato al gestore programma
		 *cancellerò anche l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}

	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEnteGestoreProgrammaEntity> getReferentiEDelegatiProgramma(Long idProgramma) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findReferentiEDelegatiProgramma(idProgramma);
	}
	
	@LogMethod
	@LogExecutionTime
	public void cancellaOTerminaAssociazioneReferenteDelegatoProgramma(ReferentiDelegatiEnteGestoreProgrammaEntity utente) {
		if(utente.getStatoUtente().equals(StatoEnum.ATTIVO.getValue())) {
			utente.setStatoUtente(StatoEnum.TERMINATO.getValue());
			utente.setDataOraTerminazione(new Date());
			this.referentiDelegatiEnteGestoreProgrammaRepository.save(utente);
		}
		if(utente.getStatoUtente().equals(StatoEnum.NON_ATTIVO.getValue())) {
			this.cancellaAssociazioneReferenteODelegatoGestoreProgramma(utente);
		}
	}
}