package it.pa.repdgt.ente.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.resource.TipologiaUbicazioneSedeResource;
import it.pa.repdgt.shared.entity.tipologica.TipologiaUbicazioneSedeEntity;
import it.pa.repdgt.shared.repository.tipologica.TipologiaUbicazioneSedeRepository;

@Service
public class TipologiaUbicazioneSedeService {

	@Autowired
	private TipologiaUbicazioneSedeRepository tipologiaUbicazioneSedeRepository;

	/**
	 * Restituisce la lista delle tipologie ubicazione selezionabili,
	 * ordinate alfabeticamente per descrizione ascendente.
	 */
	public List<TipologiaUbicazioneSedeResource> getTipologieSelezionabili() {
		List<TipologiaUbicazioneSedeEntity> tutte = this.tipologiaUbicazioneSedeRepository
				.findAll(Sort.by(Sort.Direction.ASC, "descrizione"));
		return tutte.stream()
				.filter(t -> Boolean.TRUE.equals(t.getSelezionabileSiNo()))
				.map(t -> new TipologiaUbicazioneSedeResource(t.getId(), t.getDescrizione()))
				.collect(Collectors.toList());
	}
}
