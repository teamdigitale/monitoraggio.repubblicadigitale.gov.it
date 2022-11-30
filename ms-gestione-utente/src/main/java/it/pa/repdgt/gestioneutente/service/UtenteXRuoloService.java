package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.exception.UtenteXRuoloException;
import it.pa.repdgt.gestioneutente.repository.UtenteXRuoloRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class UtenteXRuoloService {
	@Autowired
	private UtenteXRuoloRepository utenteXRuoloRepository;

	@LogMethod
	@LogExecutionTime
	public void save(UtenteXRuolo utenteXRuolo) {
		this.utenteXRuoloRepository.save(utenteXRuolo);
	}
	
	@LogMethod
	@LogExecutionTime
	public void saveAll(List<UtenteXRuolo> utenteXRuoli) {
		this.utenteXRuoloRepository.saveAll(utenteXRuoli);
	}

	@LogMethod
	@LogExecutionTime
	public UtenteXRuolo getById(UtenteXRuoloKey id) {
		if(this.utenteXRuoloRepository.findById(id).isPresent()) {
			return this.utenteXRuoloRepository.findById(id).get();
		}
		throw new UtenteXRuoloException(String.format("Associazione tra utente con codice fiscale = %s e ruolo con codice = %s non trovata.", id.getUtenteId(), id.getRuoloCodice()), CodiceErroreEnum.U18);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaRuoloUtente(UtenteXRuoloKey id) {
		this.utenteXRuoloRepository.deleteById(id);
	}

	@LogMethod
	@LogExecutionTime
	public UtenteXRuolo getUtenteXRuoloByCfUtenteAndCodiceRuolo(String codFiscaleUtente, String codiceRuolo) {
		return this.utenteXRuoloRepository.findUtenteXRuoloByCfUtenteAndCodiceRuolo(codFiscaleUtente, codiceRuolo);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteXRuolo> getListUtenteXRuoloByCfUtenteAndCodiceRuolo(String codFiscaleUtente) {
		return this.utenteXRuoloRepository.findListUtenteXRuoloByCfUtenteAndCodiceRuolo(codFiscaleUtente);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaRuoloUtente(UtenteXRuolo utenteRuolo) {
		this.utenteXRuoloRepository.delete(utenteRuolo);
		
	}

	@LogMethod
	@LogExecutionTime
	public int countRuoliByCfUtente(String cfUtente) {
		return this.utenteXRuoloRepository.countRuoliByCfUtente(cfUtente);
	}
}