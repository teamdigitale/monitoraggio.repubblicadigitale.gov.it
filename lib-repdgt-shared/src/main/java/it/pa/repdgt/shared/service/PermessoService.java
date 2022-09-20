package it.pa.repdgt.shared.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.repository.PermessoRepository;

@Service(value = "permessoServiceFiltro")
public class PermessoService {
	@Autowired
	@Qualifier(value = "permessoRepositoryFiltro")
	private PermessoRepository permessoRepository;
	
	public List<String> getCodiciPermessoByUtenteLoggato(String codiceFiscaleUtente, String codiceRuoloUtente) {
		return this.permessoRepository.findCodiciPermessoByCodiceFiscaleUtenteAndCodiceRuoloUtente(codiceFiscaleUtente, codiceRuoloUtente);
    }
}
