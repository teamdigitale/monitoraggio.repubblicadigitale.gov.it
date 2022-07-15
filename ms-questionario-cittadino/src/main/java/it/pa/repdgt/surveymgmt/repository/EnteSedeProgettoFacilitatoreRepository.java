package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;

public interface EnteSedeProgettoFacilitatoreRepository extends JpaRepository<EnteSedeProgettoFacilitatoreEntity, EnteSedeProgettoFacilitatoreKey> {

	@Query(value = "SELECT DISTINCT "
			+ "			espf.id_sede "
			+ "		FROM "
			+ "			ente_sede_progetto_facilitatore espf "
			+ "		WHERE "
			+ "			espf.id_facilitatore = :codiceFiscaleUtente "
			+ "		AND "
			+ "			espf.id_progetto = :idProgetto ",
			nativeQuery = true)
	List<String> findIdsSediFacilitatoreByCodFiscaleAndIdProgetto(
			@Param("codiceFiscaleUtente") String codiceFiscaleUtenteLoggato, 
			@Param("idProgetto") Long idProgetto);

	@Query(value = "SELECT CONCAT "
			+ "			(u.nome, ' ', u.cognome) "
			+ "		FROM "
			+ "			utente u "
			+ "		WHERE "
			+ "			u.codice_fiscale = :codiceFiscaleFacilitatore",
			nativeQuery = true)
	String findNomeCompletoFacilitatoreByCodiceFiscale(
			@Param("codiceFiscaleFacilitatore") String codiceFiscaleFacilitatore);

	@Query(value = ""
			+ " SELECT DISTINCT "
			+ "	 e.ID as id "
			+ "	,e.NOME as nome "
			+ "	,e.NOME_BREVE as nomeBreve "
			+ " FROM   "
			+ "	ente e "
			+ "	INNER JOIN ente_sede_progetto_facilitatore espf "
			+ "	ON espf.id_ente = e.ID "
			+ " WHERE 1=1 "
			+ " 	AND espf.id_facilitatore = :codiceFiscaleFacilitatore ",
			nativeQuery = true)
	List<EnteProjection> findEntiByFacilitatore(
			@Param("codiceFiscaleFacilitatore") String codiceFiscaleFacilitatore);

	@Query(value = ""
			+ " SELECT DISTINCT "
			+ "	 	s.ID as id "
			+ "	    ,s.NOME as nome "
			+ " FROM"
			+ "		sede s "
			+ "		INNER JOIN ente_sede_progetto_facilitatore espf "
			+ "		ON espf.id_sede = s.ID "
			+ " WHERE 1=1 "
			+ " 	AND espf.id_facilitatore = :codiceFiscaleFacilitatore "
			+ " 	AND espf.id_ente = :idEnte "
			+ " 	AND espf.id_progetto = :idProgetto ",
			nativeQuery = true)
	List<SedeProjection> findSediByFacilitatore(
			@Param("codiceFiscaleFacilitatore") String codiceFiscaleFacilitatore,
			@Param("idEnte") Long idEnte,
			@Param("idProgetto") Long idProgetto
		);
	
}