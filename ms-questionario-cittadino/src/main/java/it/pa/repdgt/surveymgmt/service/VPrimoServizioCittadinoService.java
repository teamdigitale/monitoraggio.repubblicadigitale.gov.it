package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.VPrimoServizioCittadinoEntity;
import it.pa.repdgt.surveymgmt.dto.RicercaCittadiniDTO;
import it.pa.repdgt.surveymgmt.repository.VPrimoServizioCittadinoRepository;
import it.pa.repdgt.surveymgmt.util.EncodeUtils;

@Service
public class VPrimoServizioCittadinoService {

    @Autowired
    private VPrimoServizioCittadinoRepository vPrimoServizioCittadinoRepository;

    public Optional<VPrimoServizioCittadinoEntity> ricercaSingola(String criterioRicercaCifrato) {
        String valoreChiaro = EncodeUtils.decrypt(criterioRicercaCifrato).trim().toUpperCase();

        // ID numerico → cerca per id_cittadino
        if (valoreChiaro.matches("^\\d+$")) {
            return this.vPrimoServizioCittadinoRepository.findByIdCittadino(Long.parseLong(valoreChiaro));
        }

        // Hash SHA-256 (64 caratteri esadecimali) → cerca direttamente per codice_fiscale
        if (valoreChiaro.matches("^[A-Fa-f0-9]{64}$")) {
            return this.vPrimoServizioCittadinoRepository.findByCodiceFiscale(valoreChiaro.toLowerCase());
        }

        // Codice fiscale (16 caratteri alfanumerici) → SHA-256 hash → cerca per codice_fiscale
        String codiceFiscaleHash = EncodeUtils.encrypt(valoreChiaro);
        return this.vPrimoServizioCittadinoRepository.findByCodiceFiscale(codiceFiscaleHash);
    }

    public RicercaCittadiniDTO ricercaMultipla(List<String> criteriRicercaCifrati) {
        List<String> valoriChiari = criteriRicercaCifrati.stream()
                .map(cifrato -> EncodeUtils.decrypt(cifrato).trim().toUpperCase())
                .collect(Collectors.toList());

        // Deduplica preservando l'ordine
        Set<String> valoriUnici = new LinkedHashSet<>(valoriChiari);

        List<VPrimoServizioCittadinoEntity> tuttiTrovati = new ArrayList<>();
        List<String> nonTrovati = new ArrayList<>();

        for (String valore : valoriUnici) {
            // La ricerca multipla accetta solo hash esadecimali a 64 caratteri
            if (!valore.matches("^[A-Fa-f0-9]{64}$")) {
                nonTrovati.add(valore);
                continue;
            }
            Optional<VPrimoServizioCittadinoEntity> risultato =
                    this.vPrimoServizioCittadinoRepository.findByCodiceFiscale(valore.toLowerCase());

            if (risultato.isPresent()) {
                tuttiTrovati.add(risultato.get());
            } else {
                nonTrovati.add(valore);
            }
        }

        RicercaCittadiniDTO dto = new RicercaCittadiniDTO();
        dto.setTrovati(tuttiTrovati);
        dto.setNonTrovati(nonTrovati);
        return dto;
    }

}
