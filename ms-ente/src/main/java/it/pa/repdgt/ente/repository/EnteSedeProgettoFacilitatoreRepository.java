package it.pa.repdgt.ente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;

public interface EnteSedeProgettoFacilitatoreRepository extends JpaRepository<EnteSedeProgettoFacilitatoreEntity, EnteSedeProgettoFacilitatoreKey> {

	@Query(value = "SELECT * "
			+ " FROM "
			+ " ente_sede_progetto_facilitatore "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGETTO = :idProgetto "
			+ " AND "
			+ " RUOLO_UTENTE = :codiceRuolo "
			+ " AND "
			+ " STATO_UTENTE =  'ATTIVO' "
			+ " AND "
			+ " ID_FACILITATORE != :codiceFiscaleUtente",
			nativeQuery = true)
	List<EnteSedeProgettoFacilitatoreEntity> findAltriFacilitatoriAttivi(String codiceFiscaleUtente, Long idProgetto, String codiceRuolo);

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
	List<EnteSedeProgettoFacilitatoreEntity> findAllFacilitatoriByEnteAndSedeAndProgetto(
			@Param("idEnte") Long idEnte, 
			@Param("idSede") Long idSede, 
			@Param("idProgetto") Long idProgetto
		);

	@Modifying
	@Query(value = "DELETE FROM ente_sede_progetto_facilitatore espf "
			+ "WHERE espf.ID_ENTE = :idEnte "
			+ "		AND espf.ID_PROGETTO = :idProgetto ",
			nativeQuery = true)
	void cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(
			@Param("idEnte") Long idEnte,
			@Param("idProgetto") Long idProgetto);

	@Query(value = "SELECT * "
			+ "FROM ente_sede_progetto_facilitatore espf "
			+ "WHERE espf.ID_ENTE = :idEnte "
			+ "		AND espf.ID_PROGETTO = :idProgetto ", 
			nativeQuery =  true)
	List<EnteSedeProgettoFacilitatoreEntity> getFacilitatoriByIdEnteAndIdProgetto(Long idEnte, Long idProgetto);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM ente_sede_progetto_facilitatore espf "
			+ "WHERE espf.ID_FACILITATORE = :facilitatore "
			+ "		AND espf.RUOLO_UTENTE = :codiceRuolo ", 
			nativeQuery = true)
	int countAssociazioniFacilitatoreAndVolontario(String facilitatore, String codiceRuolo);
}