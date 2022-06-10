package it.pa.repdgt.surveymgmt.service;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.repository.EnteSedeProgettoFacilitatoreRepository;

@Service
@Validated
public class EnteSedeProgettoFacilitatoreService {
	@Autowired
	private EnteSedeProgettoFacilitatoreRepository eteSedeProgettoFacilitatoreRepository;
 
	public EnteSedeProgettoFacilitatoreEntity getById(@NotNull final EnteSedeProgettoFacilitatoreKey id) {
		final String messaggioErrore = String.format("Facilitatore con codice fiscale '%s' non presente per ente '%s' - sede '%s' - progetto '%s' ", 
				id.getIdFacilitatore(), 
				id.getIdEnte(),
				id.getIdSede(),
				id.getIdProgetto());
		
		return this.eteSedeProgettoFacilitatoreRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
}