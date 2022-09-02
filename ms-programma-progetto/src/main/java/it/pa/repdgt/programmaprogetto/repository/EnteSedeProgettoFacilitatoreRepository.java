package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.programmaprogetto.projection.UtenteFacilitatoreProjection;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;

public interface EnteSedeProgettoFacilitatoreRepository extends JpaRepository<EnteSedeProgettoFacilitatoreEntity, EnteSedeProgettoFacilitatoreKey>{

	@Query(value = "SELECT * "
			+ " FROM "
			+ " ente_sede_progetto_facilitatore "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGETTO != :idProgetto "
			+ " AND "
			+ " RUOLO_UTENTE = :codiceRuolo "
			+ " AND "
			+ " ID_FACILITATORE = :codiceFiscaleUtente",
			nativeQuery = true)
	List<EnteSedeProgettoFacilitatoreEntity> findAltreAssociazioni(Long idProgetto, String codiceFiscaleUtente, String codiceRuolo);

	@Query(value = " SELECT * FROM "
			 + "	ente_sede_progetto_facilitatore espf"
			 + " WHERE 1=1 "
			 + "	AND ID_ENTE = :idEnte"
			 + "	AND ID_SEDE = :idSede "
			 + "	AND ID_PROGETTO = :idProgetto "
	   , nativeQuery = true)
	List<EnteSedeProgettoFacilitatoreEntity> findAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(
			@Param("idSede") Long idSede, 
			@Param("idEnte") Long idEnte, 
			@Param("idProgetto") Long idProgetto
		);
	
	@Query(value = " SELECT u.nome as nome, "
			+ "u.email as email, "
			+ "espf.RUOLO_UTENTE as codiceRuolo "
			+ "FROM "
			+ "	ente_sede_progetto_facilitatore espf "
			+ " INNER JOIN utente u "
			+ " ON u.CODICE_FISCALE = espf.id_facilitatore"
			+ " WHERE 1=1 "
			+ "	AND espf.ID_PROGETTO = :idProgetto "
			, nativeQuery = true)
	List<UtenteFacilitatoreProjection> findAllEmailFacilitatoriEVolontariByProgetto(
			@Param("idProgetto") Long idProgetto
		);


	@Query(value = " "
			+ "	SELECT "
			+ "		DISTINCT * "
			+ " FROM "
			+ "		ente_sede_progetto_facilitatore espf "
			+ " WHERE 1=1 "
			+ "		AND espf.ID_PROGETTO = :idProgetto   "
			+ "		AND espf.ID_ENTE = :idEnte           "
			+ "		AND espf.ID_FACILITATORE = :cfUtente "
			, nativeQuery = true)
	Optional<EnteSedeProgettoFacilitatoreEntity> findByIdEnteAndIdProgettoAndIdFacilitatore(
			@Param("idEnte")Long idEnte, 
			@Param("idProgetto")Long idProgetto, 
			@Param("cfUtente")String cfUtente
		);
}