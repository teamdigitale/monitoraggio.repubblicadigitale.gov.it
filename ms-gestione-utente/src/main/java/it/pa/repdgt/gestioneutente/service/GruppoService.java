package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.shared.entity.GruppoEntity;

@Service
public class GruppoService {
	@Autowired
	private GruppoRepository gruppoRepository;
	
	public GruppoEntity getGruppoByCodice(String codiceGruppo) {
		String messaggioErrore = String.format("Gruppo con codice=%s non presente", codiceGruppo);
		
		return this.gruppoRepository.findByCodice(codiceGruppo)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	public List<GruppoEntity> getGruppiByCodiciGruppi(List<String> codiciGruppi) {
		return this.gruppoRepository.findAllById(codiciGruppi);
	}

	public List<GruppoEntity> getGruppiByRuolo(String codiceRuolo) {
		return this.gruppoRepository.findGruppiByRuolo(codiceRuolo);
	}

	/**
	 * A partire dai codici dei gruppi passati come argomento, verifica se esistono tutti i gruppi 
	 * associati ai codici.
	 * Restiutisce true se esistono tutti i gruppi dati i loro codiciGruppo e false altrimenti
	 * 
	 * */
	public boolean existsAllGruppiByCodiciGruppi(List<String> codiciGruppi) {
		if(codiciGruppi == null) {
			return false;
		}
		return codiciGruppi
				.stream()
				.map(codiceGruppo -> {
					boolean existGruppo = this.getGruppoByCodice(codiceGruppo) != null;
					return existGruppo;
				 })
				.filter(Boolean.TRUE::equals)
				.count() == codiciGruppi.size();
	}
}