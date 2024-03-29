package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;

@Repository
public interface EnteSedeProgettoFacilitatoreRepository extends JpaRepository<EnteSedeProgettoFacilitatoreEntity, EnteSedeProgettoFacilitatoreKey> {
	
	@Query(value = "SELECT DISTINCT espf.ID_PROGETTO "
			+ "		FROM ente_sede_progetto_facilitatore espf "
			+ "		WHERE espf.ID_FACILITATORE = :codiceFiscale"
			+ "		AND RUOLO_UTENTE = :ruolo"
			+ "		AND STATO_UTENTE <> 'TERMINATO'", nativeQuery = true)
	List<Long> findDistinctProgettiByIdFacilitatoreNonTerminato(@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "ruolo")String ruolo);
	
	@Query(value = "SELECT * "
			+ "		FROM ente_sede_progetto_facilitatore espf "
			+ "		WHERE espf.ID_FACILITATORE = :codiceFiscale", nativeQuery = true)
	List<EnteSedeProgettoFacilitatoreEntity> findRuoloFacVolPerUtente(@Param(value = "codiceFiscale")String codiceFiscale);
	
	@Query(value = ""
			+ "     	SELECT DISTINCT espf.ID_PROGETTO as idProgetto, espf.ID_ENTE as idEnte"
			+ "			FROM ente_sede_progetto_facilitatore espf "
			+ "         INNER JOIN progetto p "
			+ "         ON p.id = espf.id_progetto "
			+ "         AND p.id_ente_gestore_progetto = espf.id_ente"
			+ "			WHERE espf.ID_FACILITATORE = :cfUtente    "
			+ "			AND RUOLO_UTENTE = :codiceRuolo           ", 
			nativeQuery = true)
	List<ProgettoEnteProjection> findIdProgettiFacilitatoreVolontarioPerGestore(
			@Param(value = "cfUtente")    String cfUtente,
			@Param(value = "codiceRuolo") String codiceRuolo);
	
	@Query(value = ""
			+ "     	SELECT DISTINCT espf.ID_PROGETTO as idProgetto, espf.ID_ENTE as idEnte"
			+ "			FROM ente_sede_progetto_facilitatore espf "
			+ "         INNER JOIN ente_partner ep "
			+ "         ON ep.id_progetto = espf.id_progetto "
			+ "         AND ep.id_ente = espf.id_ente"
			+ "			WHERE espf.ID_FACILITATORE = :cfUtente    "
			+ "			AND RUOLO_UTENTE = :codiceRuolo           ", 
			nativeQuery = true)
	List<ProgettoEnteProjection> findIdProgettiFacilitatoreVolontarioPerEntePartner(
			@Param(value = "cfUtente")    String cfUtente,
			@Param(value = "codiceRuolo") String codiceRuolo);
	
	@Query(value = "SELECT DISTINCT espf.STATO_UTENTE "
			+ "		FROM ente_sede_progetto_facilitatore espf "
			+ "		WHERE espf.ID_FACILITATORE = :cfUtente"
			+ "		AND RUOLO_UTENTE = :codiceRuolo "
			+ "     AND ID_PROGETTO = :idProgetto", 
			nativeQuery = true)
	List<String> findDistinctStatoByIdProgettoIdFacilitatoreVolontario(
			@Param(value = "cfUtente")String cfUtente,
			@Param(value = "codiceRuolo")String codiceRuolo,
			@Param(value = "idProgetto")Long idProgetto);
	
	@Query(value = "SELECT COUNT(*)"
			+ "		FROM ("
			+ "			SELECT DISTINCT espf.id_progetto, espf.id_ente "
			+ "			FROM ente_sede_progetto_facilitatore espf "
			+ "         INNER JOIN ente_partner ep "
			+ "         ON ep.id_progetto = espf.id_progetto "
			+ "         AND ep.id_ente = espf.id_ente"
			+ "			WHERE espf.ID_FACILITATORE = :cfUtente"
			+ "			AND RUOLO_UTENTE = :codiceRuolo "
			+ " "
			+ "         UNION"
			+ " "
			+ "     	SELECT DISTINCT espf.ID_PROGETTO, espf.ID_ENTE"
			+ "			FROM ente_sede_progetto_facilitatore espf "
			+ "         INNER JOIN progetto p "
			+ "         ON p.id = espf.id_progetto "
			+ "         AND p.id_ente_gestore_progetto = espf.id_ente"
			+ "			WHERE espf.ID_FACILITATORE = :cfUtente    "
			+ "			AND RUOLO_UTENTE = :codiceRuolo           "
			+ "     ) as result", 
			nativeQuery = true)
	Integer countByIdFacilitatore(
			@Param(value = "cfUtente")String cfUtente,
			@Param(value = "codiceRuolo")String codiceRuolo);
	
}