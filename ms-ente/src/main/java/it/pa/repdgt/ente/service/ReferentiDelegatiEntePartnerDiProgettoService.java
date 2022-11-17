package it.pa.repdgt.ente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class ReferentiDelegatiEntePartnerDiProgettoService {
	@Autowired
	private ReferentiDelegatiEntePartnerDiProgettoRepository referentiDelegatiEntePartnerDiProgettoRepository;

	@LogMethod
	@LogExecutionTime
	public void save(ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartnerDiProgetto) {
		this.referentiDelegatiEntePartnerDiProgettoRepository.save(referentiDelegatiEntePartnerDiProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteProjection> getReferentiEntePartnerByIdProgettoAndIdEnte(String codiceRuolo, Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findNomeStatoReferentiEntePartnerByIdProgettoAndIdEnte(codiceRuolo, idProgetto, idEnte);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteProjection> getDelegatiEntePartnerByIdProgettoAndIdEnte(String codiceRuolo, Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findNomeStatoDelegatiEntePartnerByIdProgettoAndIdEnte(codiceRuolo, idProgetto, idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public boolean esisteById(ReferentiDelegatiEntePartnerDiProgettoKey id) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.existsById(id);
	}

	@LogMethod
	@LogExecutionTime
	public ReferentiDelegatiEntePartnerDiProgettoEntity getById(ReferentiDelegatiEntePartnerDiProgettoKey id) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findById(id).get();
	}
	
	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> findAltriReferentiODelegatiAttivi(Long idProgetto, Long idEntePartner, String codiceFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findAltriReferentiODelegatiAttivi(idProgetto, idEntePartner, codiceFiscaleUtente, codiceRuolo);
	}

	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> findAltreAssociazioni(Long idProgetto, Long idEntePartner, String codiceFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findAltreAssociazioni(idProgetto, idEntePartner, codiceFiscaleUtente, codiceRuolo);
	}
	
	@LogMethod
	@LogExecutionTime
	public void cancellaAssociazioneReferenteDelegatoGestoreProgetto(
			ReferentiDelegatiEntePartnerDiProgettoKey id) {
		this.referentiDelegatiEntePartnerDiProgettoRepository.deleteById(id);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(Long idEnte, Long idProgetto) {
		this.referentiDelegatiEntePartnerDiProgettoRepository.cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> getReferentiDelegatiEntePartner(Long idEnte, Long idProgetto) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findReferentiDelegatiEntePartner(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public int countAssociazioniReferenteDelegati(String codFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.countAssociazioniReferenteDelegati(codFiscaleUtente, codiceRuolo);
	}

	@LogMethod
	@LogExecutionTime
	public ReferentiDelegatiEntePartnerDiProgettoEntity getReferenteDelegatoEntePartner(Long idProgetto,
			String codiceFiscaleUtente, Long idEnte, String codiceRuolo) {
		String errorMessage = String.format("Associazione di utente con codiceFiscale =%s a ente partner di progetto con id=%s per progetto con id=%s con codice ruolo =%s non trovata", codiceFiscaleUtente, idEnte, idProgetto, codiceRuolo);
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findReferenteDelegatoEntePartner(idProgetto, codiceFiscaleUtente, idEnte, codiceRuolo)
																	.orElseThrow( () -> new ResourceNotFoundException(errorMessage, CodiceErroreEnum.C01));
	}

	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> getReferentiAndDelegatiByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEntePartnerDiProgettoRepository.findReferentiAndDelegatiByIdProgettoAndIdEnte(idProgetto, idEnte);
	}
}