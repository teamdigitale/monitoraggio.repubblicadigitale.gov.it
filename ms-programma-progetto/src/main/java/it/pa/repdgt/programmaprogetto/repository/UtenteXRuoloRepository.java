package it.pa.repdgt.programmaprogetto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

public interface UtenteXRuoloRepository extends JpaRepository<UtenteXRuolo, UtenteXRuoloKey> { }