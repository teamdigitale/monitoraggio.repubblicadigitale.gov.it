package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class GruppoService {
	@Autowired
	private GruppoRepository gruppoRepository;
	
	@LogMethod
	@LogExecutionTime
	public List<GruppoEntity> getAllGruppi() {
		return this.gruppoRepository.findAll();
	}
	
	@LogMethod
	@LogExecutionTime
	public GruppoEntity getGruppoByCodice(String codiceGruppo) {
		String messaggioErrore = String.format("Gruppo con codice=%s non presente", codiceGruppo);
		
		return this.gruppoRepository.findByCodice(codiceGruppo)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
	
	@LogMethod
	@LogExecutionTime
	public GruppoEntity getGruppoByCodiceImpl(String codiceGruppo) {
		try {
			return getGruppoByCodice(codiceGruppo);
		}catch(Exception e) {
			return null;
		}	
	}
	
	@LogMethod
	@LogExecutionTime
	public List<GruppoEntity> getGruppiByCodiciGruppi(List<String> codiciGruppi) {
		return this.gruppoRepository.findAllById(codiciGruppi);
	}

	@LogMethod
	@LogExecutionTime
	public List<GruppoEntity> getGruppiByRuolo(String codiceRuolo) {
		return this.gruppoRepository.findGruppiByRuolo(codiceRuolo);
	}

	/**
	 * A partire dai codici dei gruppi passati come argomento, verifica se esistono tutti i gruppi 
	 * associati ai codici.
	 * Restiutisce true se esistono tutti i gruppi dati i loro codiciGruppo e false altrimenti
	 * 
	 * */
	@LogMethod
	@LogExecutionTime
	public boolean existsAllGruppiByCodiciGruppi(List<String> codiciGruppi) {
		if(codiciGruppi == null) {
			return false;
		}
		return codiciGruppi
				.stream()
				.map(codiceGruppo -> {
					boolean existGruppo = this.getGruppoByCodiceImpl(codiceGruppo) != null;
					return existGruppo;
				 })
				.filter(Boolean.TRUE::equals)
				.count() == codiciGruppi.size();
	}
}