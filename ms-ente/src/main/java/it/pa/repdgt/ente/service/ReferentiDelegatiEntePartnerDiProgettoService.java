package it.pa.repdgt.ente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.annotation.LogExecutionTime;
import it.pa.repdgt.ente.annotation.LogMethod;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@Service
public class ReferentiDelegatiEntePartnerDiProgettoService {
	@Autowired
	private ReferentiDelegatiEntePartnerDiProgettoRepository referentiDelegatiEntePartnerDiProgettoRepository;
	
	// MI SERVE
	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public void save(ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartnerDiProgetto) {
		this.referentiDelegatiEntePartnerDiProgettoRepository.save(referentiDelegatiEntePartnerDiProgetto);
	}
	
	public List<UtenteProjection> getReferentiEntePartnerByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findNomeStatoReferentiEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
	}
	
	public List<UtenteProjection> getDelegatiEntePartnerByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findNomeStatoDelegatiEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
	}

	public boolean esisteById(ReferentiDelegatiEntePartnerDiProgettoKey id) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.existsById(id);
	}

	public ReferentiDelegatiEntePartnerDiProgettoEntity getById(ReferentiDelegatiEntePartnerDiProgettoKey id) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.getById(id);
	}
	
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> findAltriReferentiODelegatiAttivi(Long idProgetto, Long idEntePartner, String codiceFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findAltriReferentiODelegatiAttivi(idProgetto, idEntePartner, codiceFiscaleUtente, codiceRuolo);
	}

	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> findAltreAssociazioni(Long idProgetto, Long idEntePartner, String codiceFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findAltreAssociazioni(idProgetto, idEntePartner, codiceFiscaleUtente, codiceRuolo);
	}
	
	public void cancellaAssociazioneReferenteDelegatoGestoreProgetto(
			ReferentiDelegatiEntePartnerDiProgettoKey id) {
		this.referentiDelegatiEntePartnerDiProgettoRepository.deleteById(id);
	}

	public void cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(Long idEnte, Long idProgetto) {
		this.referentiDelegatiEntePartnerDiProgettoRepository.cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(idEnte, idProgetto);
	}

	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> getReferentiDelegatiEntePartner(Long idEnte, Long idProgetto) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findReferentiDelegatiEntePartner(idEnte, idProgetto);
	}

	public int countAssociazioniReferenteDelegati(String codFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.countAssociazioniReferenteDelegati(codFiscaleUtente, codiceRuolo);
	}

	public ReferentiDelegatiEntePartnerDiProgettoEntity getReferenteDelegatoEntePartner(Long idProgetto,
			String codiceFiscaleUtente, Long idEnte) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findReferenteDelegatoEntePartner(idProgetto, codiceFiscaleUtente, idEnte);
	}
}