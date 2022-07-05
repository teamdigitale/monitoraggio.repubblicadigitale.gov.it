package it.pa.repdgt.ente.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ProgrammaRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class ProgrammaService {
	@Autowired
	@Lazy
	private EnteService enteService;
	@Autowired
	private ProgrammaRepository programmaRepository;
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteProgrammaById(Long id) {
		return this.programmaRepository.existsById(id);
	}

	public List<Long> getIdProgrammiByIdEnte(Long idEnte) {
		return this.programmaRepository.findIdProgrammiByIdEnte(idEnte);
	}

	public ProgrammaEntity getProgrammaById(Long id) {
		String messaggioErrore = String.format("Programma con id=%s non presente", String.valueOf(id));
		return this.programmaRepository.findById(id)
									   .orElseThrow( () -> new ResourceNotFoundException(messaggioErrore));
	}

	public int countProgrammiEnte(Long idEnte) {
		return this.programmaRepository.countProgrammiEnte(idEnte);
	}

	public Long getIdEnteGestoreProgramma(Long idProgramma) {
		return this.programmaRepository.findIdEnteGestoreProgramma(idProgramma);
	}

	public List<ProgrammaEntity> getProgrammiByIdEnte(Long idEnte) {
		return this.programmaRepository.findProgrammiByIdEnte(idEnte);
	}

	public void salvaProgramma(ProgrammaEntity programmaFetchDB) {
		this.programmaRepository.save(programmaFetchDB);
	}
	
	/**
	 * @throws ProgrammaException
	 */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void assegnaEnteGestoreProgramma(Long idProgramma, Long idEnteGestore) {
		ProgrammaEntity programmaFetchDB = null;
		try {
			programmaFetchDB = this.getProgrammaById(idProgramma);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile assegnare ente con id=%s come gestore del programma con id=%s. Programma non presente", idEnteGestore, idProgramma);
			throw new EnteException(errorMessage);
		}
		EnteEntity enteFetchDB = null;
		try {
			enteFetchDB = this.enteService.getEnteById(idEnteGestore);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile assegnare ente con id=%s come gestore del programma con id=%s. Ente non presente", idEnteGestore, idProgramma);
			throw new EnteException(errorMessage);
		}
		programmaFetchDB.setEnteGestoreProgramma(enteFetchDB);
		programmaFetchDB.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		this.salvaProgramma(programmaFetchDB);
	}
}