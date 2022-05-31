package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.SedeEntity;

@Repository
public interface SedeRepository extends JpaRepository<SedeEntity, Long> {

	@Query(value = "SELECT * "
			+ "FROM sede sede"
			+ "	INNER JOIN ente_sede_progetto esp "
			+ "		ON sede.ID = esp.ID_SEDE "
			+ "WHERE esp.ID_PROGETTO = :idProgetto ",
			nativeQuery = true)
	List<SedeEntity> findSediByIdProgetto(@Param(value = "idProgetto") Long idProgetto);

	@Query(value ="SELECT esp.STATO_SEDE "
			+ "FROM ente_sede_progetto esp "
			+ "WHERE esp.ID_PROGETTO = :idProgetto "
			+ "		AND esp.ID_SEDE = :idSede "
			+ "		AND esp.ID_ENTE = :idEnte ", 
			nativeQuery = true)
	public String findStatoSedeByIdProgettoAndIdSedeAndIdEnte(
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "idSede") Long idSede,
			@Param(value = "idEnte") Long idEnte
	);

}
