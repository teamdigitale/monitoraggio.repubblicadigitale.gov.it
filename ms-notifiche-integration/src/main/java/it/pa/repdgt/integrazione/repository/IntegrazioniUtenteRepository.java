package it.pa.repdgt.integrazione.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.IntegrazioniUtenteEntity;

public interface IntegrazioniUtenteRepository extends JpaRepository<IntegrazioniUtenteEntity, Long> {

	@Query(value = "SELECT * FROM integrazioni_utente it WHERE it.UTENTE_ID = :idUtente", nativeQuery = true)
	Optional<IntegrazioniUtenteEntity> findByUserId(
			@Param(value="idUtente") Long idUtente
		); 
}