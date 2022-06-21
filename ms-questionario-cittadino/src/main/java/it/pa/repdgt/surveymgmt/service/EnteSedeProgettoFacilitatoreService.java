package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.EnteSedeProgettoFacilitatoreRepository;

@Service
@Validated
public class EnteSedeProgettoFacilitatoreService {
	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
 
	public EnteSedeProgettoFacilitatoreEntity getById(@NotNull final EnteSedeProgettoFacilitatoreKey id) {
		final String messaggioErrore = String.format("Facilitatore con codice fiscale '%s' non presente per ente '%s' - sede '%s' - progetto '%s' ", 
				id.getIdFacilitatore(), 
				id.getIdEnte(),
				id.getIdSede(),
				id.getIdProgetto());
		
		return this.enteSedeProgettoFacilitatoreRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}

	public List<String> getIdsSediFacilitatoreByCodFiscaleAndIdProgetto(String codiceFiscaleUtenteLoggato, Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.findIdsSediFacilitatoreByCodFiscaleAndIdProgetto(codiceFiscaleUtenteLoggato, idProgetto);
	}

	public String getNomeCompletoFacilitatoreByCodiceFiscale(String codiceFiscaleFacilitatore) {
		return this.enteSedeProgettoFacilitatoreRepository.findNomeCompletoFacilitatoreByCodiceFiscale(codiceFiscaleFacilitatore);
	}

	public List<EnteProjection> getEntiByFacilitatore(ProfilazioneParam profilazioneParam) {
		return this.enteSedeProgettoFacilitatoreRepository.findEntiByFacilitatore(profilazioneParam.getCodiceFiscaleUtenteLoggato());
	}

	public List<SedeProjection> getSediByFacilitatore(ProfilazioneParam profilazioneParam) {
		return this.enteSedeProgettoFacilitatoreRepository.findSediByFacilitatore(profilazioneParam.getCodiceFiscaleUtenteLoggato());
	}
}