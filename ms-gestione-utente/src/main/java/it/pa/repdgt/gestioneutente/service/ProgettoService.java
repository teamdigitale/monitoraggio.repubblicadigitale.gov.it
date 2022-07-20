package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.repository.ProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgettoEntity;

@Service
public class ProgettoService {
	@Autowired
	private ProgettoRepository progettoRepository;

	@LogMethod
	@LogExecutionTime
	public List<Long> getDistinctIdProgettiByRuoloUtente(String cfUtente, String ruolo) {
		return this.progettoRepository.findDistinctIdProgettiByRuoloUtente(cfUtente, ruolo);
	}

	@LogMethod
	@LogExecutionTime
	public ProgettoEntity getProgettoById(Long id) {
		return this.progettoRepository.findById(id).get();
	}
}