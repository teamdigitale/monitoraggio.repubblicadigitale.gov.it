package it.pa.repdgt.ente.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.exception.UtenteXRuoloException;
import it.pa.repdgt.ente.repository.UtenteXRuoloRepository;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

@Service
public class UtenteXRuoloService {
	@Autowired
	private UtenteXRuoloRepository utenteXRuoloRepository;

	public void save(UtenteXRuolo utenteXRuolo) {
		this.utenteXRuoloRepository.save(utenteXRuolo);
	}

	public UtenteXRuolo getById(UtenteXRuoloKey id) {
		if(this.utenteXRuoloRepository.findById(id).isPresent()) {
			return this.utenteXRuoloRepository.findById(id).get();
		}
		throw new UtenteXRuoloException(String.format("Associazione tra utente con codice fiscale = %s e ruolo con codice = %s non trovata.", id.getGruppoCodice(), id.getRuoloCodice()));
	}

	public void cancellaRuoloUtente(UtenteXRuoloKey id) {
		this.utenteXRuoloRepository.deleteById(id);
	}

	public UtenteXRuolo getUtenteXRuoloByCfUtenteAndCodiceRuolo(String codFiscaleUtente, String codiceRuolo) {
		return this.utenteXRuoloRepository.findUtenteXRuoloByCfUtenteAndCodiceRuolo(codFiscaleUtente, codiceRuolo);
	}

	public void cancellaRuoloUtente(UtenteXRuolo utenteRuolo) {
		this.utenteXRuoloRepository.delete(utenteRuolo);
		
	}
}
