package it.pa.repdgt.ente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;

@Service
public class ReferentiDelegatiEnteGestoreProgrammaService {
	@Autowired
	private ReferentiDelegatiEnteGestoreProgrammaRepository referentiDelegatiEnteGestoreProgrammaRepository;
	
	// MI SERVE
	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public void save(ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgramma) {
		this.referentiDelegatiEnteGestoreProgrammaRepository.save(referentiDelegatiEnteGestoreProgramma);
	}
	
	public List<UtenteProjection> getReferentiEnteGestoreByProgramma(Long idProgramma) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findNomeStatoReferentiEnteGestoreByProgramma(idProgramma);
	}
	
	public List<UtenteProjection> getDelegatiEnteGestoreByProgramma(Long idProgramma) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findNomeStatoDelegatiEnteGestoreByProgramma(idProgramma);
	}

	public void cancellaAssociazioneReferenteDelegatoGestoreProgramma(
			ReferentiDelegatiEnteGestoreProgrammaKey id) {
		this.referentiDelegatiEnteGestoreProgrammaRepository.deleteById(id);
	}

	public boolean esisteById(ReferentiDelegatiEnteGestoreProgrammaKey id) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.existsById(id);
	}

	public List<ReferentiDelegatiEnteGestoreProgrammaEntity> findAltriReferentiODelegatiAttivi(Long idProgramma, String codiceFiscaleUtente, Long idEnte, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findAltriReferentiODelegatiAttivi(idProgramma, codiceFiscaleUtente, idEnte, codiceRuolo);
	}

	public List<ReferentiDelegatiEnteGestoreProgrammaEntity> findAltreAssociazioni(Long idProgramma, String codiceFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findAltreAssociazioni(idProgramma, codiceFiscaleUtente, codiceRuolo);
	}

	public ReferentiDelegatiEnteGestoreProgrammaEntity getById(ReferentiDelegatiEnteGestoreProgrammaKey id) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.getById(id);
	}

	public List<ReferentiDelegatiEnteGestoreProgrammaEntity> getReferentiAndDelegatiPerProgramma(Long idProgramma) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findReferentiAndDelegatiPerProgramma(idProgramma);
	}

	public void cancellaAssociazione(ReferentiDelegatiEnteGestoreProgrammaEntity utente) {
		this.referentiDelegatiEnteGestoreProgrammaRepository.delete(utente);
	}

	public int countAssociazioniReferenteDelegato(String codFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.countAssociazioniReferenteDelegato(codFiscaleUtente, codiceRuolo);
	}

	public ReferentiDelegatiEnteGestoreProgrammaEntity getReferenteDelegatiEnteGestoreProgramma(Long idProgramma,
			String codiceFiscaleUtente, Long idEnte) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findReferenteDelegatiEnteGestoreProgramma(idProgramma, codiceFiscaleUtente, idEnte);
	}
}