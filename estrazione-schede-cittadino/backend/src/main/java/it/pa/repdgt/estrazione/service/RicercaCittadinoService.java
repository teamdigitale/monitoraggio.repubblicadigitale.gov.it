package it.pa.repdgt.estrazione.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.estrazione.dto.PrimoServizioCittadinoDTO;
import it.pa.repdgt.estrazione.dto.RicercaCittadiniDTO;
import it.pa.repdgt.estrazione.dto.ScartoRicercaDTO;
import it.pa.repdgt.estrazione.entity.VPrimoServizioCittadinoEntity;
import it.pa.repdgt.estrazione.mapper.PrimoServizioCittadinoMapper;
import it.pa.repdgt.estrazione.repository.VPrimoServizioCittadinoRepository;
import it.pa.repdgt.estrazione.util.EncodeUtils;

@Service
public class RicercaCittadinoService {

	private static final String REGEX_ID_NUMERICO = "^\\d+$";
	private static final String REGEX_HASH_64 = "^[A-Fa-f0-9]{64}$";
	private static final String REGEX_HASH_64_CI = "(?i)^[a-f0-9]{64}$";

	@Autowired
	private VPrimoServizioCittadinoRepository vPrimoServizioCittadinoRepository;

	@Autowired
	private PrimoServizioCittadinoMapper primoServizioCittadinoMapper;

	@Autowired
	private QuestionarioCompetenzaService questionarioCompetenzaService;

	/**
	 * Ricerca singola. Il criterio in chiaro puo' essere: id numerico,
	 * hash SHA-256 (64 esadecimali) oppure codice fiscale in chiaro (di cui si
	 * calcola l'hash per il confronto con la vista).
	 */
	public List<PrimoServizioCittadinoDTO> ricercaSingola(String criterio) {
		String valore = criterio == null ? "" : criterio.trim().toUpperCase();

		List<VPrimoServizioCittadinoEntity> entities;
		if (valore.matches(REGEX_ID_NUMERICO)) {
			entities = vPrimoServizioCittadinoRepository.findByIdCittadino(Long.parseLong(valore));
		} else if (valore.matches(REGEX_HASH_64)) {
			entities = vPrimoServizioCittadinoRepository.findByCodiceFiscale(valore.toLowerCase());
		} else {
			String codiceFiscaleHash = EncodeUtils.encrypt(valore);
			entities = vPrimoServizioCittadinoRepository.findByCodiceFiscale(codiceFiscaleHash);
		}

		return entities.stream()
				.map(this::toDTOConCompetenza)
				.collect(Collectors.toList());
	}

	/**
	 * Ricerca multipla: accetta solo hash esadecimali di 64 caratteri; ogni
	 * codice non valido o senza riscontro finisce tra gli scarti (con numero riga).
	 */
	public RicercaCittadiniDTO ricercaMultipla(List<String> criteri) {
		List<String> valori = new ArrayList<>();
		if (criteri != null) {
			for (String c : criteri) {
				valori.add(c == null ? "" : c.trim());
			}
		}

		Map<String, List<VPrimoServizioCittadinoEntity>> cache = new HashMap<>();
		Set<Long> idGiaInseriti = new HashSet<>();
		List<VPrimoServizioCittadinoEntity> tuttiTrovati = new ArrayList<>();
		List<ScartoRicercaDTO> nonTrovati = new ArrayList<>();

		for (int i = 0; i < valori.size(); i++) {
			String valore = valori.get(i);
			int riga = i + 1;

			if (!valore.matches(REGEX_HASH_64_CI)) {
				nonTrovati.add(new ScartoRicercaDTO(riga, valore));
				continue;
			}

			String chiaveLookup = valore.toLowerCase();
			List<VPrimoServizioCittadinoEntity> risultati = cache.computeIfAbsent(
					chiaveLookup,
					k -> vPrimoServizioCittadinoRepository.findByCodiceFiscale(k));

			if (!risultati.isEmpty()) {
				for (VPrimoServizioCittadinoEntity r : risultati) {
					if (idGiaInseriti.add(r.getIdCittadino())) {
						tuttiTrovati.add(r);
					}
				}
			} else {
				nonTrovati.add(new ScartoRicercaDTO(riga, valore));
			}
		}

		RicercaCittadiniDTO dto = new RicercaCittadiniDTO();
		dto.setTrovati(tuttiTrovati.stream()
				.map(this::toDTOConCompetenza)
				.collect(Collectors.toList()));
		dto.setNonTrovati(nonTrovati);
		return dto;
	}

	private PrimoServizioCittadinoDTO toDTOConCompetenza(VPrimoServizioCittadinoEntity entity) {
		PrimoServizioCittadinoDTO dto = primoServizioCittadinoMapper.toDTO(entity);
		dto.setCompetenzaDigitale(questionarioCompetenzaService.getCompetenzaDigitale(entity.getIdQuestionario()));
		return dto;
	}

}
