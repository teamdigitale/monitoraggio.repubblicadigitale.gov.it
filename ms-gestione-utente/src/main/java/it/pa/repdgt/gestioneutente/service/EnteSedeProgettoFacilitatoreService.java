package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;

@Service
public class EnteSedeProgettoFacilitatoreService {

	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;

	@LogMethod
	@LogExecutionTime
	public List<ProgettoEnteProjection> getIdProgettiFacilitatoreVolontarioPerGestore(String cfUtente, String codiceRuolo) {
		return this.enteSedeProgettoFacilitatoreRepository.findIdProgettiFacilitatoreVolontarioPerGestore(cfUtente, codiceRuolo);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<ProgettoEnteProjection> getIdProgettiFacilitatoreVolontarioPerEntePartner(String cfUtente, String codiceRuolo) {
		return this.enteSedeProgettoFacilitatoreRepository.findIdProgettiFacilitatoreVolontarioPerEntePartner(cfUtente, codiceRuolo);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> getDistinctStatoByIdProgettoIdFacilitatoreVolontario(String cfUtente, String codiceRuolo, Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.findDistinctStatoByIdProgettoIdFacilitatoreVolontario(cfUtente, codiceRuolo, idProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	public Integer countByIdFacilitatore(String cfUtente, String codiceRuolo) {
		return this.enteSedeProgettoFacilitatoreRepository.countByIdFacilitatore(cfUtente, codiceRuolo);
	}
	
	
}

