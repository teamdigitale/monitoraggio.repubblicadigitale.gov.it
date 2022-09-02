package it.pa.repdgt.shared.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.repository.RuoloRepository;

@Service(value = "ruoloServiceFiltro")
public class RuoloService {
	@Autowired
	@Qualifier(value = "ruoloRepositoryFiltro")
	private RuoloRepository ruoloRepository;
	
	public List<String> getRuoliByCodiceFiscaleUtente(String codiceFiscale) {
		return this.ruoloRepository.findRuoloByCodiceFiscaleUtente(codiceFiscale);
    }
}
