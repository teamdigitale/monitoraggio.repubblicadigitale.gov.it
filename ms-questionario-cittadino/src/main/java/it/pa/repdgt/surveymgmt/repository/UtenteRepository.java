package it.pa.repdgt.surveymgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import it.pa.repdgt.shared.entity.UtenteEntity;

public interface UtenteRepository extends JpaRepository<UtenteEntity, String> {

	Optional<UtenteEntity> findByCodiceFiscale(String idUtente);
}