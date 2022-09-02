package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Repository
public interface ProgrammaRepository extends JpaRepository<ProgrammaEntity, Long> {

	@Query(value = "SELECT distinct rdg.ID_PROGRAMMA "
			+ "FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.CF_UTENTE = :cfUtente "
			+ " 	AND rdg.CODICE_RUOLO = :ruolo ",
			nativeQuery = true)
	List<Long> findDistinctIdProgrammiByRuoloUtente(
			@Param(value = "cfUtente") String cfUtente,
			@Param(value = "ruolo") String ruolo
	);
}