package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.VPrimoServizioCittadinoEntity;
import it.pa.repdgt.surveymgmt.dto.RicercaCittadiniDTO;
import it.pa.repdgt.surveymgmt.dto.ScartoRicercaDTO;
import it.pa.repdgt.surveymgmt.repository.VPrimoServizioCittadinoRepository;
import it.pa.repdgt.surveymgmt.util.EncodeUtils;

@Service
public class VPrimoServizioCittadinoService {

    @Autowired
    private VPrimoServizioCittadinoRepository vPrimoServizioCittadinoRepository;

    public List<VPrimoServizioCittadinoEntity> ricercaSingola(String criterioRicercaCifrato) {
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
        // Decritta senza forzare uppercase (i codici hex sono case sensitive per lo scarti)
        List<String> valoriChiari = new ArrayList<>();
        for (String cifrato : criteriRicercaCifrati) {
            valoriChiari.add(EncodeUtils.decrypt(cifrato).trim());
        }

        // Cache risultati per evitare query duplicate sullo stesso codice
        Map<String, List<VPrimoServizioCittadinoEntity>> cache = new HashMap<>();
        Set<Long> idGiaInseriti = new HashSet<>();
        List<VPrimoServizioCittadinoEntity> tuttiTrovati = new ArrayList<>();
        List<ScartoRicercaDTO> nonTrovati = new ArrayList<>();

        for (int i = 0; i < valoriChiari.size(); i++) {
            String valore = valoriChiari.get(i);
            int riga = i + 1;

            // La ricerca multipla accetta solo hash esadecimali a 64 caratteri
            if (!valore.matches("(?i)^[a-f0-9]{64}$")) {
                nonTrovati.add(new ScartoRicercaDTO(riga, valore));
                continue;
            }

            String chiaveLookup = valore.toLowerCase();
            List<VPrimoServizioCittadinoEntity> risultati = cache.computeIfAbsent(
                    chiaveLookup,
                    k -> this.vPrimoServizioCittadinoRepository.findByCodiceFiscale(k)
            );

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
        dto.setTrovati(tuttiTrovati);
        dto.setNonTrovati(nonTrovati);
        return dto;
    }

}
