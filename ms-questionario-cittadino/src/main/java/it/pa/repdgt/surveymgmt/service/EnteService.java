package it.pa.repdgt.surveymgmt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.repository.EnteRepository;

@Service
public class EnteService {
	@Autowired
	private EnteRepository enteRepository;
	
	public EnteEntity getById(final Long idEnte) {
		final String messaggioErrore = String.format("Ente con id %s non presente", idEnte);
		return this.enteRepository.findById(idEnte)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
}