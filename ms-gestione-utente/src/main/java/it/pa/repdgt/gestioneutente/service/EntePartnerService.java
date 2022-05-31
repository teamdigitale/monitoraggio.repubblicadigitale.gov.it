package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.repository.EntePartnerRepository;

@Service
public class EntePartnerService {
	@Autowired
	private EntePartnerRepository entePartnerRepository;

	public List<Long> getIdProgettiEntePartnerByRuoloUtente(String cfUtente, String ruolo) {
		return this.entePartnerRepository.findIdProgettiEntePartnerByRuoloUtente(cfUtente, ruolo);
	}
}