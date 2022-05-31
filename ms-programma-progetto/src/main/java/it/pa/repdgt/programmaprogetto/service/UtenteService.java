package it.pa.repdgt.programmaprogetto.service;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.UtenteRepository;

@Service
public class UtenteService {
    @Autowired
    private UtenteRepository utenteRepository;

	public int countFacilitatoriPerSedeProgettoEnte(Long idProgetto, Long idSede, Long idEnte) {
		return this.utenteRepository.countFacilitatoriPerSedeProgettoEnte(idProgetto, idSede, idEnte);
	}
	
	public boolean esisteUtenteByCodiceFiscale(@NotNull String codiceFiscale) {
		return this.utenteRepository.findByCodiceFiscale(codiceFiscale).isPresent();
	}
}