package it.pa.repdgt.surveymgmt.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.surveymgmt.repository.RuoloRepository;

@Service
public class RuoloService {
	@Autowired
	private RuoloRepository ruoloRepository;
	
	@LogMethod
	@LogExecutionTime
	public List<RuoloEntity> getRuoliByCodiceFiscale(String codiceFiscale) {
		return this.ruoloRepository.findRuoliByCodiceFiscale(codiceFiscale);
	}
}