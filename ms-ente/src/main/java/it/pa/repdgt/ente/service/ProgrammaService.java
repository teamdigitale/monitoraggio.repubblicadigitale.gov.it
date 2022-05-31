package it.pa.repdgt.ente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.annotation.LogExecutionTime;
import it.pa.repdgt.ente.annotation.LogMethod;
import it.pa.repdgt.ente.repository.ProgrammaRepository;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Service
public class ProgrammaService {
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
		return this.programmaRepository.findById(id).get();
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
}