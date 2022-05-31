package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.EnteEntity;

@Repository
public interface EnteRepository extends JpaRepository<EnteEntity, Long> { 
	@Query(value = "SELECT esp.RUOLO_ENTE "
			+ "FROM ente_sede_progetto esp "
			+ "WHERE esp.ID_PROGETTO = :idProgetto "
			+ "		AND esp.ID_SEDE = :idSede "
		    + "		AND esp.ID_ENTE = :idEnte ", 
			nativeQuery = true)
	public String findRuoloEnteByIdProgettoAndIdSedeAndIdEnte(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "idSede") Long idSede,
			@Param(value = "idEnte") Long idEnte
	);

	@Query(value = "SELECT esp.ID_ENTE "
			+ "FROM ente_sede_progetto esp "
			+ "WHERE esp.ID_PROGETTO = :idProgetto "
			+ "		AND esp.ID_SEDE = :idSede ",
			nativeQuery = true)
	public List<Long> findIdEnteByIdProgettoAndIdSede(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "idSede") Long idSede
	);
}
