package it.pa.repdgt.shared.repository.storico;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.storico.StoricoEntePartnerEntity;
import it.pa.repdgt.shared.projection.storico.ProgrammaProjection;

@Repository
public interface StoricoEntePartnerRepository extends JpaRepository<StoricoEntePartnerEntity, Long> {
	@Query(value = "SELECT * "
			+ "FROM storico_ente_partner "
			+ "where PROGRAMMA_ID = :idProgramma "
			+ "AND ente_id = :idEnte "
			+ "AND progetto_id = :idProgetto", nativeQuery = true)
	Optional<StoricoEntePartnerEntity> findStoricoEnteByIdProgrammaAndIdEnteAndIdProgetto(@Param(value = "idProgramma")Long idProgramma,
			@Param(value = "idEnte")Long idEnte,
			@Param(value = "idProgetto")Long idProgetto);
	
	@Query(value = "SELECT ID_PROGRAMMA as idProgramma "
			+ "FROM progetto "
			+ "where ID = :idProgetto ", nativeQuery = true)
	ProgrammaProjection findIdProgrammaByIdProgetto(@Param(value = "idProgetto")Long idProgetto);
}