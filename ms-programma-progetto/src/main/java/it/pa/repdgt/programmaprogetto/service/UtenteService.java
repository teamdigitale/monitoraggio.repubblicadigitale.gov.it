package it.pa.repdgt.programmaprogetto.service;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.UtenteRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;

@Service
public class UtenteService {
    @Autowired
    private UtenteRepository utenteRepository;

    @LogMethod
	@LogExecutionTime
	public int countFacilitatoriPerSedeProgettoEnte(Long idProgetto, Long idSede, Long idEnte) {
		return this.utenteRepository.countFacilitatoriPerSedeProgettoEnte(idProgetto, idSede, idEnte);
	}
	
    @LogMethod
	@LogExecutionTime
	public boolean esisteUtenteByCodiceFiscale(@NotNull String codiceFiscale) {
		return this.utenteRepository.findByCodiceFiscale(codiceFiscale).isPresent();
	}
}