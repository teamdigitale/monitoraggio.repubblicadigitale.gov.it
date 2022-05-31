package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgettoEntity;

@Repository
public interface ProgettoRepository extends JpaRepository<ProgettoEntity, Long> {

	@Query(value = "SELECT rdgp.ID_PROGETTO "
			+ "FROM REFERENTE_DELEGATI_GESTORE_PROGETTO rdgp "
			+ "WHERE rdgp.CF_UTENTE = :cfUtente "
			+ "		AND rdgp.CODICE_RUOLO = :ruolo ",
			nativeQuery = true)
	public List<Long> findIdProgettiByRuoloUtente(
			@Param(value = "cfUtente") String cfUtente,
			@Param(value = "ruolo") String ruolo
	);
}