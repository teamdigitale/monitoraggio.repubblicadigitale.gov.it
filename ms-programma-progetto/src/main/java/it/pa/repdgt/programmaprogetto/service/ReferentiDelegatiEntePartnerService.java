package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.ReferentiDelegatiEntePartnerRepository;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@Service
public class ReferentiDelegatiEntePartnerService {	
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private ReferentiDelegatiEntePartnerRepository referentiDelegatiEntePartnerRepository;
	
	@Transactional(rollbackOn = Exception.class)
	public void cancellaReferentiDelegatiPartner(Long idProgetto) {
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiDelegati = this.referentiDelegatiEntePartnerRepository.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(idProgetto);
		
		referentiDelegati.stream().forEach(this::cancellaAssociazioneReferenteODelegatoPartner);
	}
	
	/**
	 * Cancella associazione Utente Referente o utente delegato all'ente gestore di progetto
	 * */
	@Transactional(rollbackOn = Exception.class)
    public void cancellaAssociazioneReferenteODelegatoPartner(ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartner) {
		Long idProgetto = referentiDelegatiEntePartner.getId().getIdProgetto();
		Long idEnte = referentiDelegatiEntePartner.getId().getIdEnte();
		String codiceFiscaleUtente = referentiDelegatiEntePartner.getId().getCodFiscaleUtente();
		String codiceRuolo  = referentiDelegatiEntePartner.getCodiceRuolo().toUpperCase();
		ReferentiDelegatiEntePartnerDiProgettoKey id =  new ReferentiDelegatiEntePartnerDiProgettoKey(idProgetto, idEnte, codiceFiscaleUtente);
		
		this.referentiDelegatiEntePartnerRepository.deleteById(id);
		
		//Controllo se l'utente è REPP o DEPP(a seconda del codiceRuolo che mi viene passato) su altri gestori progetto oltre a questo
		boolean unicaAssociazione = this.referentiDelegatiEntePartnerRepository.findAltreAssociazioni(idProgetto, idEnte, codiceFiscaleUtente, codiceRuolo).isEmpty();
		
		/*Se la condizione sopra è vera allora insieme all'associazione del referente/delegato all'ente partner
		 * cancellerò anche l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}

	public void salvaReferenteODelegato(ReferentiDelegatiEntePartnerDiProgettoEntity utente) {
		this.referentiDelegatiEntePartnerRepository.save(utente);
	}

	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> getReferentiEDelegatiEntePartner(Long idEnte,
			Long idProgetto) {
		return this.referentiDelegatiEntePartnerRepository.findReferentiEDelegatiEntePartner(idEnte, idProgetto);
	}
}