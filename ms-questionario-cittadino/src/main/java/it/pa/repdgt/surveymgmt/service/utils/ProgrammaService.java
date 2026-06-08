package it.pa.repdgt.surveymgmt.service.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.repository.ProgrammaRepository;

@Service
public class ProgrammaService {
	@Autowired
	private ProgrammaRepository programmaRepository;

	@LogMethod
	@LogExecutionTime
	public ProgrammaEntity getProgrammaById(Long id) {
		final String messaggioErrore = String.format("Programma con id %s non presente", id);
		return this.programmaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
}
