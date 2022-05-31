package it.pa.repdgt.ente.service;


import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.exception.RuoloException;
import it.pa.repdgt.ente.repository.RuoloRepository;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

@Service
public class RuoloService {
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private UtenteXRuoloService utenteXRuoloService;
	@Autowired
	private RuoloRepository ruoloRepository;
	
	public List<RuoloEntity> getRuoliByCodiceFiscale(String codiceFiscale) {
		return this.ruoloRepository.findRuoliByCodiceFiscale(codiceFiscale);
	}
	
	public RuoloEntity getRuoloByCodiceRuolo(String codiceRuolo) {
		return this.ruoloRepository.findByCodice(codiceRuolo);
	}

	@Transactional(rollbackOn = Exception.class)
	public void aggiungiRuoloAUtente(String codiceFiscaleUtente, String codiceRuolo) {
		boolean esisteUtente = this.utenteService.esisteUtenteByCodiceFiscale(codiceFiscaleUtente);
		if(!esisteUtente) {
			throw new RuoloException(String.format("Impossibile aggiungere ruolo all'utente. Utente con codice fiscale '%s' non esiste", codiceFiscaleUtente));
		}
		boolean esisteRuolo = this.ruoloRepository.existsById(codiceRuolo);
		if(!esisteRuolo) {
			throw new RuoloException(String.format("Impossibile aggiungere il ruolo all'utente. Ruolo con codice '%s' non esiste", codiceRuolo));
		}
		UtenteXRuoloKey id = new UtenteXRuoloKey(codiceFiscaleUtente, codiceRuolo);
		UtenteXRuolo utenteXRuolo = new UtenteXRuolo();
		utenteXRuolo.setId(id);
		utenteXRuolo.setDataOraCreazione(new Date());
		this.utenteXRuoloService.save(utenteXRuolo);
	}

	@Transactional(rollbackOn = Exception.class)
	public void cancellaRuoloUtente(String codiceFiscaleUtente, String codiceRuolo) {
		boolean esisteUtente = this.utenteService.esisteUtenteByCodiceFiscale(codiceFiscaleUtente);
		if(!esisteUtente) {
			throw new RuoloException(String.format("Impossibile cancellare il ruolo per l'utente. Utente con codice fiscale '%s' non esiste", codiceFiscaleUtente));
		}
		boolean esisteRuolo = this.ruoloRepository.existsById(codiceRuolo);
		if(!esisteRuolo) {
			throw new RuoloException(String.format("Impossibile cancellare il ruolo per l'utente. Ruolo con codice '%s' non esiste", codiceRuolo));
		}
		UtenteXRuoloKey id = new UtenteXRuoloKey(codiceFiscaleUtente, codiceRuolo);
		this.utenteXRuoloService.cancellaRuoloUtente(id);
	}
}