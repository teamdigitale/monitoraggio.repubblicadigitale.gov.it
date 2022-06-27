package it.pa.repdgt.shared.repository.storico;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.storico.StoricoEnteGestoreProgettoEntity;

@Repository
public interface StoricoEnteGestoreProgettoRepository extends JpaRepository<StoricoEnteGestoreProgettoEntity, Long> {
	@Query(value = "SELECT * "
			+ "FROM storico_ente_gestore_progetto "
			+ "where PROGRAMMA_ID = :idProgramma "
			+ "AND ente_id = :idEnte "
			+ "AND progetto_id = :idProgetto", nativeQuery = true)
	Optional<StoricoEnteGestoreProgettoEntity> findStoricoEnteByIdProgrammaAndIdEnteAndIdProgetto(@Param(value = "idProgramma")Long idProgramma,
			@Param(value = "idEnte")Long idEnte,
			@Param(value = "idProgetto")Long idProgetto);
}