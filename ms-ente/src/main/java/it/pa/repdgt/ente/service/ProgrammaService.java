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
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

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

	@LogMethod
	@LogExecutionTime
	public List<Long> getIdProgrammiByIdEnte(Long idEnte) {
		return this.programmaRepository.findIdProgrammiByIdEnte(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public ProgrammaEntity getProgrammaById(Long id) {
		String messaggioErrore = String.format("Programma con id=%s non presente", String.valueOf(id));
		return this.programmaRepository.findById(id)
									   .orElseThrow( () -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}

	@LogMethod
	@LogExecutionTime
	public int countProgrammiEnte(Long idEnte) {
		return this.programmaRepository.countProgrammiEnte(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public Long getIdEnteGestoreProgramma(Long idProgramma) {
		return this.programmaRepository.findIdEnteGestoreProgramma(idProgramma);
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getProgrammiByIdEnte(Long idEnte) {
		return this.programmaRepository.findProgrammiByIdEnte(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public void salvaProgramma(ProgrammaEntity programmaFetchDB) {
		this.programmaRepository.save(programmaFetchDB);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void assegnaEnteGestoreProgramma(Long idProgramma, Long idEnteGestore) {
		ProgrammaEntity programmaFetchDB = null;
		try {
			programmaFetchDB = this.getProgrammaById(idProgramma);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile assegnare ente con id=%s come gestore del programma con id=%s. Programma non presente", idEnteGestore, idProgramma);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN03);
		}
		EnteEntity enteFetchDB = null;
		try {
			enteFetchDB = this.enteService.getEnteById(idEnteGestore);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile assegnare ente con id=%s come gestore del programma con id=%s. Ente non presente", idEnteGestore, idProgramma);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN03);
		}
		programmaFetchDB.setEnteGestoreProgramma(enteFetchDB);
		programmaFetchDB.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		this.salvaProgramma(programmaFetchDB);
	}
}