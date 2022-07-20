package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;
import it.pa.repdgt.surveymgmt.repository.ProgettoRepository;

@Service
@Validated
public class ProgettoService {
	@Autowired
	private ProgettoRepository progettoRepository;
	
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity getProgettoById(@NotNull final Long idProgetto) {
		final String messaggioErrore = String.format("Progetto con id '%s' non presente.", idProgetto);
		return this.progettoRepository.findById(idProgetto)
					.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	@LogMethod
	@LogExecutionTime
	public List<ProgettoProjection> getProgettiByServizio(
			@NotNull Long idServizio) {
		return this.progettoRepository.findProgettiByServizio(idServizio);
	}
}