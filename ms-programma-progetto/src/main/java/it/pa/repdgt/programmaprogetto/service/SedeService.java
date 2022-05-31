package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.annotation.LogExecutionTime;
import it.pa.repdgt.programmaprogetto.annotation.LogMethod;
import it.pa.repdgt.programmaprogetto.repository.SedeRepository;
import it.pa.repdgt.shared.entity.SedeEntity;

@Service
public class SedeService {
	
	@Autowired
	private SedeRepository sedeRepository;

	@LogMethod
	@LogExecutionTime
	public List<SedeEntity> getSediByIdProgetto(Long idProgetto) {
		return this.sedeRepository.findSediByIdProgetto(idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public String getStatoSedeByIdProgettoAndIdSedeAndIdEnte(Long idProgetto, Long idSede, Long idEnte) {
		return this.sedeRepository.findStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, idSede, idEnte);
	}
}