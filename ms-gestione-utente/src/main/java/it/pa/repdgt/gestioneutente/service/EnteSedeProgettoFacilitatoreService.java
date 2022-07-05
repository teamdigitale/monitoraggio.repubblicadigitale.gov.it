package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.repository.EnteSedeProgettoFacilitatoreRepository;

@Service
public class EnteSedeProgettoFacilitatoreService {

	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;

	public List<Long> getIdProgettiFacilitatoreVolontario(String cfUtente, String codiceRuolo) {
		return this.enteSedeProgettoFacilitatoreRepository.findIdProgettiFacilitatoreVolontario(cfUtente, codiceRuolo);
	}
	
	
}
