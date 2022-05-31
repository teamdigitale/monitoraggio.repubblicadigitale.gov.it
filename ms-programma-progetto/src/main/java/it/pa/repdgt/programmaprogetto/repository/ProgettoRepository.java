package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;

@Repository
public interface ProgettoRepository extends JpaRepository<ProgettoEntity, Long> {
	
	@Query(value = "SELECT p "
				 + "FROM ProgettoLightEntity p "
				 + "WHERE p.id = :theId")
	public Optional<ProgettoLightEntity> findProgettoLightById(@Param(value="theId") Long id);
	
	
	@Query(value = "SELECT *"
				+ " FROM "
				+ "		progetto progetto"
				+ " INNER JOIN programma programma "
				+ "		ON programma.ID = progetto.ID_PROGRAMMA"
				+ " WHERE 	1=1"
				+ " 	AND	 ( :nomeProgetto IS NULL  			OR   progetto.NOME LIKE %:nomeProgetto% )"
				+ " 	AND  ( COALESCE(:policies) IS NULL  	OR  programma.POLICY IN (:policies) )"
				+ " 	AND  ( COALESCE(:stati) IS NULL  		OR  programma.STATO IN (:stati) )"
				+ " 	AND  ( COALESCE(:idsProgrammi) IS NULL  OR  progetto.ID_PROGRAMMA IN (:idsProgrammi) )", 
			nativeQuery = true)
	public List<ProgettoEntity> findByFilter(
			@Param(value = "nomeProgetto") String nomeProgetto, 
			@Param(value = "policies") List<String> policy,
			@Param(value = "stati")  List<String> stati,
			@Param(value = "idsProgrammi") List<String> idsProgrammi
		);
	
	@Query(value = "SELECT * "
				 + "FROM progetto p "
				 + "WHERE p.STATO != 'NON ATTIVO'", 
		   nativeQuery = true)
	public List<ProgettoEntity> findAll();

	@Query(value = "SELECT * FROM progetto p WHERE p.ID_PROGRAMMA = :idProgramma", nativeQuery = true)
	public List<ProgettoEntity> findProgettiByIdProgramma(@Param(value="idProgramma") Long idProgramma);

	@Query(value = "SELECT progetto.*"
			+ " FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  1=1"
		    + " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
		  nativeQuery = true)
	public List<ProgettoEntity> findAll(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies,
			@Param(value = "idsProgrammi") List<String> idsProgrammi, 
			@Param(value = "stati") List<String> stati);


	@Query(value = "SELECT *"
			+ " FROM "
			+ "		progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE 	1=1"
			+ "		AND programma.POLICY = :policy "
		    + " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
		   nativeQuery = true)
	public List<ProgettoEntity> findByPolicy(
				String policy,
				@Param(value = "criterioRicerca") String criterioRicerca,
				@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
				@Param(value = "idsProgrammi") List<String> idsProgrammi, 
				@Param(value = "stati") List<String> stati
			);


	@Query(value = "SELECT DISTINCT progetto.STATO"
			+ " FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  1=1"
		    + " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
		    + " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
		  nativeQuery = true)
	public List<String> findAllStati(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies, 
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);
			
	@Query(value = "SELECT DISTINCT progetto.STATO"
			+ " FROM "
			+ "		progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE 	1=1"
			+ "		AND programma.POLICY = :policy "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			   nativeQuery = true)
	public List<String> findStatiByPolicy(
			String policy,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);
	
	@Query(value = "SELECT DISTINCT progetto.STATO"
			+ " FROM progetto progetto INNER JOIN programma programma ON progetto.ID_PROGRAMMA = programma.ID "
			+ " WHERE 1=1"
			+ "		AND progetto.ID = :idProgetto"
			+ " 	AND	 ( :nomeProgetto IS NULL  OR   progetto.NOME LIKE %:nomeProgetto% )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			nativeQuery = true)
	public Optional<String> findStatoById (
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "nomeProgetto") String nomeProgettoLike,
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "policies") List<String> policies,
			@Param(value = "stati") List<String> stati
		);

	@Query(value = "SELECT progetto.*"
			+ " FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ " INNER JOIN referente_delegati_gestore_progetto rdgp "
			+ "		ON progetto.ID = rdgp.ID_PROGETTO "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  progetto.ID_PROGRAMMA = :idProgramma "
			+ " 	AND  rdgp.CF_UTENTE = :cfUtente "
			+ " 	AND  rdgp.CODICE_RUOLO = :codiceRuolo "
		    + " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			nativeQuery = true)
	public List<ProgettoEntity> findProgettiPerReferenteDelegatoGestoreProgetti(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "cfUtente") String cfUtente, 
			@Param(value = "codiceRuolo") String codiceRuolo,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies,
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);

	@Query(value = "SELECT progetto.* "
			+ "FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ "WHERE progetto.ID_PROGRAMMA = :idProgramma"
		    + " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			nativeQuery = true)
	public List<ProgettoEntity> findProgettiPerReferenteDelegatoGestoreProgramma(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies,
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);

	@Query(value = "SELECT DISTINCT progetto.*"
			+ " FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ " INNER JOIN ente_partner ep "
			+ "		ON progetto.ID = ep.ID_PROGETTO "
			+ " INNER JOIN referente_delegati_partner  rdp "
			+ "		ON ep.ID_ENTE = rdp.ID_ENTE "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  progetto.ID_PROGRAMMA = :idProgramma "
			+ " 	AND  rdp.CF_UTENTE = :cfUtente "
			+ " 	AND  rdp.CODICE_RUOLO = :codiceRuolo "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			nativeQuery = true)
	public List<ProgettoEntity> findProgettiPerReferenteDelegatoEntePartnerProgetti(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "cfUtente") String cfUtente, 
			@Param(value = "codiceRuolo") String codiceRuolo,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies,
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);

	@Query(value = "SELECT progetto.STATO "
			+ "FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ "WHERE progetto.ID_PROGRAMMA = :idProgramma"
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			nativeQuery = true)
	public List<String> findStatiPerReferenteDelegatoGestoreProgramma(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies,
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);

	@Query(value = "SELECT progetto.STATO"
			+ " FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ " INNER JOIN referente_delegati_gestore_progetto rdgp "
			+ "		ON progetto.ID = rdgp.ID_PROGETTO "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  progetto.ID_PROGRAMMA = :idProgramma "
			+ " 	AND  rdgp.CF_UTENTE = :cfUtente "
			+ " 	AND  rdgp.CODICE_RUOLO = :codiceRuolo "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			nativeQuery = true)
	public List<String> findStatiPerReferenteDelegatoGestoreProgetti(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "cfUtente") String cfUtente, 
			@Param(value = "codiceRuolo") String codiceRuolo,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies,
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);

	@Query(value = "SELECT progetto.STATO"
			+ " FROM progetto progetto "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ " INNER JOIN ente_partner ep "
			+ "		ON progetto.ID = ep.ID_PROGETTO "
			+ " INNER JOIN referente_delegati_partner  rdp "
			+ "		ON ep.ID_ENTE = rdp.ID_ENTE "
			+ "	INNER JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  progetto.ID_PROGRAMMA = :idProgramma "
			+ " 	AND  rdp.CF_UTENTE = :cfUtente "
			+ " 	AND  rdp.CODICE_RUOLO = :codiceRuolo "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
			+ "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND	 ( COALESCE(:idsProgrammi) IS NULL  OR   programma.ID IN (:idsProgrammi) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )",
			nativeQuery = true)
	public List<String> findStatiPerReferenteDelegatoEntePartnerProgetti(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "cfUtente") String cfUtente, 
			@Param(value = "codiceRuolo") String codiceRuolo,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "policies") List<String> policies,
			@Param(value = "idsProgrammi") List<String> idsProgrammi,
			@Param(value = "stati") List<String> stati
		);
}