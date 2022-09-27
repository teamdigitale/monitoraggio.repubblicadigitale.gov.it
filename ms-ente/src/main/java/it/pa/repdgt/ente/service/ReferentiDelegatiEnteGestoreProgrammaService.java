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
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class ReferentiDelegatiEnteGestoreProgrammaService {
	@Autowired
	private ReferentiDelegatiEnteGestoreProgrammaRepository referentiDelegatiEnteGestoreProgrammaRepository;
	
	@LogMethod
	@LogExecutionTime
	public void save(ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgramma) {
		this.referentiDelegatiEnteGestoreProgrammaRepository.save(referentiDelegatiEnteGestoreProgramma);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteProjection> getReferentiEnteGestoreByIdProgrammaAndIdEnte(Long idProgramma, Long idEnte) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findNomeStatoReferentiEnteGestoreByIdProgrammaAndIdEnte(idProgramma, idEnte);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteProjection> getDelegatiEnteGestoreByIdProgrammaAndIdEnte(Long idProgramma, Long idEnte) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findNomeStatoDelegatiEnteGestoreByIdProgrammaAndIdEnte(idProgramma, idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaAssociazioneReferenteDelegatoGestoreProgramma(
			ReferentiDelegatiEnteGestoreProgrammaKey id) {
		this.referentiDelegatiEnteGestoreProgrammaRepository.deleteById(id);
	}

	@LogMethod
	@LogExecutionTime
	public boolean esisteById(ReferentiDelegatiEnteGestoreProgrammaKey id) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.existsById(id);
	}

	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEnteGestoreProgrammaEntity> findAltriReferentiODelegatiAttivi(Long idProgramma, String codiceFiscaleUtente, Long idEnte, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findAltriReferentiODelegatiAttivi(idProgramma, codiceFiscaleUtente, idEnte, codiceRuolo);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEnteGestoreProgrammaEntity> findAltreAssociazioni(Long idProgramma, String codiceFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findAltreAssociazioni(idProgramma, codiceFiscaleUtente, codiceRuolo);
	}

	@LogMethod
	@LogExecutionTime
	public ReferentiDelegatiEnteGestoreProgrammaEntity getById(ReferentiDelegatiEnteGestoreProgrammaKey id) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findById(id).get();
	}

	@LogMethod
	@LogExecutionTime
	public List<ReferentiDelegatiEnteGestoreProgrammaEntity> getReferentiAndDelegatiByIdProgrammaAndIdEnte(Long idProgramma, Long idEnte) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findReferentiAndDelegatiByIdProgrammaAndIdEnte(idProgramma, idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaAssociazione(ReferentiDelegatiEnteGestoreProgrammaEntity utente) {
		this.referentiDelegatiEnteGestoreProgrammaRepository.delete(utente);
	}

	@LogMethod
	@LogExecutionTime
	public int countAssociazioniReferenteDelegato(String codFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgrammaRepository.countAssociazioniReferenteDelegato(codFiscaleUtente, codiceRuolo);
	}

	@LogMethod
	@LogExecutionTime
	public ReferentiDelegatiEnteGestoreProgrammaEntity getReferenteDelegatiEnteGestoreProgramma(Long idProgramma,
			String codiceFiscaleUtente, Long idEnte, String codiceRuolo) {
		String errorMessage = String.format("Associazione di utente con codiceFiscale =%s a ente gestore di programma con id=%s per programma con id=%s con codice ruolo =%s non trovata", codiceFiscaleUtente, idEnte, idProgramma, codiceRuolo);
		return this.referentiDelegatiEnteGestoreProgrammaRepository.findReferenteDelegatiEnteGestoreProgramma(idProgramma, codiceFiscaleUtente, idEnte, codiceRuolo)
																	.orElseThrow( () -> new ResourceNotFoundException(errorMessage, CodiceErroreEnum.C01));
	}
}