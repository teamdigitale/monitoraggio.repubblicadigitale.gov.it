package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.repository.ProgrammaRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Service
public class ProgrammaService {
	@Autowired
	private ProgrammaRepository programmaRepository;

	@LogMethod
	@LogExecutionTime
	public List<Long> getDistinctIdProgrammiByRuoloUtente(String cfUtente, String ruolo) {
		return this.programmaRepository.findDistinctIdProgrammiByRuoloUtente(cfUtente, ruolo);
	}

	@LogMethod
	@LogExecutionTime
	public ProgrammaEntity getProgrammaById(Long id) {
		return this.programmaRepository.findById(id).get();
	}
}