package it.pa.repdgt.ente.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.UtenteRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class UtenteService {
	@Autowired
	private UtenteRepository utenteRepository;

	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteByCodiceFiscale(String codiceFiscale) {
		String messaggioErrore = String.format("Utente con codice fiscale =%s non presente", codiceFiscale);
		return this.utenteRepository.findByCodiceFiscale(codiceFiscale)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
	
	@LogMethod
	@LogExecutionTime
	public void updateUtente(UtenteEntity utenteEntity) {
		this.utenteRepository.save(utenteEntity);
	}
	
	@LogMethod
	@LogExecutionTime
	public int countFacilitatoriPerSedeProgettoEnte(Long idProgetto, Long idSede, Long idEnte) {
		return this.utenteRepository.countFacilitatoriPerSedeProgettoEnte(idProgetto, idSede, idEnte);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> getReferentiProgrammaById(Long id) {
		return this.utenteRepository.findReferentiProgrammaById(id);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getReferentiProgettoById(Long id) {
		return this.utenteRepository.findReferentiProgettoById(id);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getReferentiEntePartnerProgettoById(Long idProgetto, Long idEnte) {
		return this.utenteRepository.findReferentiEntePartnerProgettoById(idProgetto, idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public boolean esisteUtenteByCodiceFiscale(@NotNull String codiceFiscale) {
		return this.utenteRepository.findByCodiceFiscale(codiceFiscale).isPresent();
	}
}