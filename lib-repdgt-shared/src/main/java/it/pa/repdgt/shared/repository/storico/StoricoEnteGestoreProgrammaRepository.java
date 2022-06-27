package it.pa.repdgt.shared.repository.storico;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.storico.StoricoEnteGestoreProgrammaEntity;

@Repository
public interface StoricoEnteGestoreProgrammaRepository extends JpaRepository<StoricoEnteGestoreProgrammaEntity, Long> { 
	@Query(value = "SELECT * "
			+ "FROM storico_ente_gestore_programma "
			+ "where PROGRAMMA_ID = :idProgramma "
			+ "AND ente_id = :idEnte", nativeQuery = true)
	Optional<StoricoEnteGestoreProgrammaEntity> findStoricoEnteByIdProgrammaAndIdEnte(@Param(value = "idProgramma")Long idProgramma,
			@Param(value = "idEnte")Long idEnte);
}