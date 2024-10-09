package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.EnteSedeProgettoFacilitatoreRepository;

@Service
@Validated
public class EnteSedeProgettoFacilitatoreService {
	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
 
	@LogMethod
	@LogExecutionTime
	public EnteSedeProgettoFacilitatoreEntity getById(@NotNull final EnteSedeProgettoFacilitatoreKey id) {
		final String messaggioErrore = String.format("Utente con codice fiscale '%s' non presente per ente '%s' - sede '%s' - progetto '%s' ", 
				id.getIdFacilitatore(), 
				id.getIdEnte(),
				id.getIdSede(),
				id.getIdProgetto());
		
		return this.enteSedeProgettoFacilitatoreRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(String codiceFiscaleUtenteLoggato, Long idProgetto, Long idEnte) {
		return this.enteSedeProgettoFacilitatoreRepository.findIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(codiceFiscaleUtenteLoggato, idProgetto, idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public String getNomeCompletoFacilitatoreByCodiceFiscale(String codiceFiscaleFacilitatore) {
		return this.enteSedeProgettoFacilitatoreRepository.findNomeCompletoFacilitatoreByCodiceFiscale(codiceFiscaleFacilitatore);
	}

	@LogMethod
	@LogExecutionTime
	public List<EnteProjection> getEntiByFacilitatore(SceltaProfiloParam profilazioneParam) {
		return this.enteSedeProgettoFacilitatoreRepository.findEntiByFacilitatoreAndIdProgetto(profilazioneParam.getCfUtenteLoggato(),
				profilazioneParam.getIdProgetto());
	}

	@LogMethod
	@LogExecutionTime
	public List<SedeProjection> getSediByFacilitatore(SceltaProfiloParam profilazioneParam) {
		return this.enteSedeProgettoFacilitatoreRepository.findSediByFacilitatore(
				profilazioneParam.getCfUtenteLoggato(),
				profilazioneParam.getIdEnte(),
				profilazioneParam.getIdProgetto()
			);
	}
}