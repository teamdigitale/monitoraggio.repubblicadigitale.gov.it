package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.EntePartnerRepository;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;

@Service
public class EntePartnerService {
	@Autowired
	private EntePartnerRepository entePartnerRepository;

	public List<Long> getIdProgettiEntePartnerByRuoloUtente(String cfUtente, String ruolo) {
		return this.entePartnerRepository.findIdProgettiEntePartnerByRuoloUtente(cfUtente, ruolo);
	}
	
	public EntePartnerEntity findEntePartnerByIdProgettoAndIdEnte(Long idEnte, Long idProgetto) {
		String messaggioErrore = String.format("ente partner non presente per idEnte %s, idProgetto %s", idEnte, idProgetto);
		return this.entePartnerRepository.findById(new EntePartnerKey(idProgetto, idEnte))
				.orElseThrow(() -> new UtenteException(messaggioErrore));
	}
}