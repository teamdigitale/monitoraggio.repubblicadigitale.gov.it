package it.pa.repdgt.programmaprogetto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.UtenteXRuoloRepository;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

@Service
public class UtenteXRuoloService {
	@Autowired
	private UtenteXRuoloRepository utenteXRuoloRepository;

	public void cancellaRuoloUtente(UtenteXRuoloKey id) {
		this.utenteXRuoloRepository.deleteById(id);
	}
}
