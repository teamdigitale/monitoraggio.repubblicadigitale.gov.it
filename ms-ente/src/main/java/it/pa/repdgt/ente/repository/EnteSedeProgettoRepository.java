package it.pa.repdgt.ente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;

public interface EnteSedeProgettoRepository extends JpaRepository<EnteSedeProgetto, EnteSedeProgettoKey> {

	@Query(value = " SELECT "
				 + "	COUNT(*) "
				 + " FROM ( "
				 + "		SELECT "
				 + "			DISTINCT( esp.ID_ENTE || '-' || esp.ID_SEDE || '-' || esp.ID_PROGETTO ) as associazioneEnteSedeProgetto "
				 + "		FROM "
				 + "			ente_sede_progetto esp "
				 + " 			INNER JOIN ente_sede_progetto_facilitatore espf"
				 + "			ON esp.ID_ENTE = espf.ID_ENTE "
				 + "				AND esp.ID_SEDE = espf.ID_SEDE "
				 + "				AND esp.ID_PROGETTO = espf.ID_PROGETTO "
				 + "		WHERE 1=1"
				 + "			AND esp.STATO_SEDE= 'ATTIVO' AND esp.ID_PROGETTO = :idProgetto"
				 + " ) as epsf "
				 + " WHERE epsf.associazioneEnteSedeProgetto <> :associazioneEnteSedeProgetto ",
		   nativeQuery = true)
	public int findAltreSediAttiveConFacilitatore(
		@Param(value = "idProgetto") Long idProgetto,
		@Param(value = "associazioneEnteSedeProgetto") String associazioneEnteSedeProgetto
	);

	@Modifying
	@Query(value = "DELETE FROM ente_sede_progetto esp "
			+ "WHERE esp.ID_ENTE = :idEnte "
			+ "		AND esp.ID_PROGETTO = :idProgetto ", 
			nativeQuery = true)
	public void cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgetto(
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "idProgetto") Long idProgetto
	);

	@Query(value = "SELECT * "
			+ "FROM ente_sede_progetto esp "
			+ "WHERE esp.ID_ENTE = :idEnte "
			+ "		AND esp.ID_PROGETTO = :idProgetto ", 
			nativeQuery = true)
	public List<EnteSedeProgetto> findSediPerProgettoAndEnte(Long idEnte, Long idProgetto);
	
}