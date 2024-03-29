package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.exception.RuoloException;
import it.pa.repdgt.programmaprogetto.repository.RuoloRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class RuoloService {
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private UtenteXRuoloService utenteXRuoloService;
	@Autowired
	private RuoloRepository ruoloRepository;

	@LogMethod
	@LogExecutionTime
	public List<String> getCodiceRuoliByCodiceFiscaleUtente(String codiceFiscale) {
		return this.ruoloRepository.findRuoloByCodiceFiscaleUtente(codiceFiscale);
    }
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaRuoloUtente(String codiceFiscaleUtente, String codiceRuolo) {
		boolean esisteUtente = this.utenteService.esisteUtenteByCodiceFiscale(codiceFiscaleUtente);
		if(!esisteUtente) {
			throw new RuoloException(String.format("Impossibile attivare ruolo per utente con codice fiscale = %s non esistente.", codiceFiscaleUtente), CodiceErroreEnum.R07);
		}
		boolean esisteRuolo = this.ruoloRepository.existsById(codiceRuolo);
		if(!esisteRuolo) {
			throw new RuoloException(String.format("Impossibile attivare ruolo con codice = %s non esistente a utente", codiceRuolo), CodiceErroreEnum.R07);
		}
		UtenteXRuoloKey id = new UtenteXRuoloKey(codiceFiscaleUtente, codiceRuolo);
		this.utenteXRuoloService.cancellaRuoloUtente(id);
	}
}