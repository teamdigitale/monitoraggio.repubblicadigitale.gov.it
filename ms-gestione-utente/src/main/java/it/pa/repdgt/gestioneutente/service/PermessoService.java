package it.pa.repdgt.gestioneutente.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.PermessoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.PermessoEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class PermessoService {
	@Autowired
	private PermessoRepository permessoRepository;
	
	@LogMethod
	@LogExecutionTime
	public PermessoEntity getPermessoById(Long idPermesso) {
		String messaggioErrore = String.format("Permesso con id=%s non trovato", idPermesso);
		return this.permessoRepository.findById(idPermesso)
				.orElseThrow( () -> new ResourceNotFoundException(messaggioErrore,CodiceErroreEnum.C01) );
	}
	
	@LogExecutionTime
	@LogMethod
	public PermessoEntity save(PermessoEntity permesso) {
		return this.permessoRepository.save(permesso);
	}
}