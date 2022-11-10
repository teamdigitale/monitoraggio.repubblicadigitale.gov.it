package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Repository
public interface ProgrammaRepository extends JpaRepository<ProgrammaEntity, Long> {
	@Query(value = "SELECT p FROM ProgrammaEntity p")
	public List<ProgrammaEntity> findAllEager();
	
	@Query(value = "SELECT p FROM ProgrammaEntity p WHERE p.id = :theId")
	public Optional<ProgrammaEntity> findById(@Param(value = "theId") Long idProgramma);
	
	public Optional<ProgrammaEntity> findByNome(String nomeProgramma);
	
	@Query(value = "SELECT p FROM ProgrammaEntity p WHERE p.codice = :theCodice")
	public Optional<ProgrammaEntity> findProgrammaByCodice(@Param(value = "theCodice") String codice);
	
	@Query(value = "SELECT * FROM programma p", nativeQuery = true)
	public List<ProgrammaEntity> findAll();
	
	@Query(value = "SELECT programma.* "
			+ " FROM programma programma "
			+ "	LEFT JOIN ente ente "
			+ "		ON programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE  1=1 "
		    + " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR programma.CODICE = :criterioRicerca "
		    + "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
	        + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) ) ",
		  nativeQuery = true)
	public List<ProgrammaEntity> findAll(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati
		);
	
	@Query(value = "SELECT programma.* "
			+ " FROM programma programma "
			+ "	LEFT JOIN ente ente "
			+ "		ON programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE  1=1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR programma.CODICE = :criterioRicerca "
			+ "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( programma.NOME ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) ) "
			+ "	ORDER BY programma.nome_breve "
			+ " LIMIT :currPageIndex, :pageSize",
			nativeQuery = true)
	public List<ProgrammaEntity> findAllPaginati(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati,
			@Param(value = "currPageIndex") Integer currPageIndex, 
			@Param(value = "pageSize") Integer pageSize
			);
	
	@Query(value = "SELECT count(*) "
			+ " FROM programma programma "
			+ "	LEFT JOIN ente ente "
			+ "		ON programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE  1=1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR programma.CODICE = :criterioRicerca "
			+ "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( programma.NOME ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) ) ",
			nativeQuery = true)
	public Long countAll(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati
			);
	
	@Query(value = "SELECT DISTINCT programma.*"
			+ " FROM "
			+ "		programma programma "
			+ " INNER JOIN "
			+ "		progetto progetto "
			+ " ON "
			+ "		programma.ID = progetto.ID_PROGRAMMA"
			+ "	LEFT JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  1=1"
			+ " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
		    + "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )"
			+ "		AND  ( COALESCE(:idsProgrammi) IS NULL OR progetto.ID_PROGRAMMA IN (:idsProgrammi) )",
		  nativeQuery = true)
	public List<ProgrammaEntity> findAllByProgettoFiltro(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati,
			@Param(value = "idsProgrammi") List<String> idsProgrammi
		);
	
	@Query(value = "SELECT *"
			+ " FROM "
			+ "		programma programma  "
			+ "	LEFT JOIN "
			+ "		ente ente "
			+ "	ON "
			+ "		programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE 	1=1"
			+ "		AND programma.POLICY = :policy "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR UPPER( programma.CODICE ) = UPPER( :criterioRicerca ) "
		    + "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
		    + "			OR UPPER( programma.NOME ) LIKE UPPER( :criterioRicercaLike ) "
	        + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )"
			+ "	ORDER BY programma.nome_breve "
			+ " LIMIT :currPageIndex, :pageSize",
		   nativeQuery = true)
	public List<ProgrammaEntity> findProgrammiByPolicyPaginati(
				String policy,
				@Param(value = "criterioRicerca") String criterioRicerca,
				@Param(value = "criterioRicercaLike") String criterioRicercaLike,
				@Param(value = "stati") List<String> stati,
				@Param(value = "currPageIndex") Integer currPageIndex, 
				@Param(value = "pageSize") Integer pageSize
			);
	
	@Query(value = "SELECT *"
			+ " FROM "
			+ "		programma programma  "
			+ "	LEFT JOIN "
			+ "		ente ente "
			+ "	ON "
			+ "		programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE 	1=1"
			+ "		AND programma.POLICY = :policy "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR UPPER( programma.CODICE ) = UPPER( :criterioRicerca ) "
			+ "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
			nativeQuery = true)
	public List<ProgrammaEntity> findProgrammiByPolicy(
			String policy,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "stati") List<String> stati
			);
	
	@Query(value = "SELECT *"
			+ " FROM "
			+ "		programma programma  "
			+ "	LEFT JOIN "
			+ "		ente ente "
			+ "	ON "
			+ "		programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE 	1=1"
			+ "		AND programma.POLICY = :policy "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR UPPER( programma.CODICE ) = UPPER( :criterioRicerca ) "
			+ "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
			nativeQuery = true)
	public List<ProgrammaEntity> findProgrammiByPolicyPaginati(
			String policy,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "stati") List<String> stati
			);
	
	@Query(value = "SELECT count(*)"
			+ " FROM "
			+ "		programma programma  "
			+ "	LEFT JOIN "
			+ "		ente ente "
			+ "	ON "
			+ "		programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE 	1=1"
			+ "		AND programma.POLICY = :policy "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
			+ "			OR UPPER( programma.CODICE ) = UPPER( :criterioRicerca ) "
			+ "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( programma.NOME ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
			nativeQuery = true)
	public Long countProgrammiByPolicy(
			String policy,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "stati") List<String> stati
			);
	
	@Query(value = "SELECT DISTINCT programma.*"
			+ " FROM "
			+ "		programma programma  "
			+ " INNER JOIN"
			+ "		progetto progetto"
			+ " ON "
			+ "		programma.ID = progetto.ID_PROGRAMMA"
			+ "	LEFT JOIN "
			+ "		ente ente "
			+ "	ON "
			+ "		progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE 	1=1"
			+ "		AND programma.POLICY = :policy "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
		    + "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
	        + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )"
			+ "		AND  ( COALESCE(:idsProgrammi) IS NULL OR progetto.ID_PROGRAMMA IN (:idsProgrammi) )",
		   nativeQuery = true)
	public List<ProgrammaEntity> findByPolicy(
				String policy,
				@Param(value = "criterioRicerca") String criterioRicerca,
				@Param(value = "criterioRicercaLike") String criterioRicercaLike,
				@Param(value = "stati") List<String> stati,
				@Param(value = "idsProgrammi") List<String> idsProgrammi
			);
	
	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM programma programma"
			+ "	LEFT JOIN ente ente "
			+ "		ON programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE  1=1 "
		    + " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR UPPER( programma.CODICE ) = UPPER( :criterioRicerca ) "
		    + "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
	        + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		  nativeQuery = true)
	public List<String> findAllStati(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati
		);
	
	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM programma programma"
			+ "	LEFT JOIN ente ente "
			+ "		ON programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE  1=1 "
		    + " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR UPPER( programma.CODICE ) = UPPER( :criterioRicerca )  "
		    + "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
	        + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
			nativeQuery = true)
	public List<String> findAllPolicies(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati);
	
	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM "
			+ "		programma programma"
			+ " INNER JOIN"
			+ "		progetto progetto"
			+ " ON "
			+ "		programma.ID = progetto.ID_PROGRAMMA"
			+ "	LEFT JOIN ente ente "
			+ "		ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID "
			+ " WHERE  1=1 "
		    + " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR CONVERT(progetto.ID, CHAR) = :criterioRicerca "
		    + "			OR UPPER( progetto.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
	        + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR progetto.STATO IN (:stati) )"
			+ "		AND  ( COALESCE(:idsProgrammi) IS NULL OR progetto.ID_PROGRAMMA IN (:idsProgrammi) )",
		  nativeQuery = true)
	public List<String> findAllPoliciesByProgettoFiltro(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati,
			@Param(value = "idsProgrammi") List<String> idsProgrammi
		);
	
	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM programma programma"
			+ " WHERE programma.id = :idProgramma",
			nativeQuery = true)
	public Optional<String> findStatoById (
			@Param(value = "idProgramma") Long idProgramma);
	
	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM programma programma"
			+ " WHERE "
			+ "		programma.id = :idProgramma",
			nativeQuery = true)
	public Optional<String> findPolicyById (
			@Param(value = "idProgramma") Long idProgramma);
	
	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM programma programma "
			+ " WHERE  1=1"
			+ " 	AND programma.CF_UTENTE_REFERENTE_GESTORE = :codFiscale"
			+ " 	AND	 ( :nomeProgramma IS NULL  OR   programma.NOME LIKE %:nomeProgramma% )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		   nativeQuery = true)
	public Set<String> findStatiPerReferenteGestoreProgramma(
			@Param(value = "codFiscale") String codiceFiscale,
			@Param(value = "nomeProgramma") String nomeProgrammaLike, 
			@Param(value = "policies") List<String> policies, 
			@Param(value = "stati") List<String> stati);

	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM "
			+ "		progetto progetto "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE  1=1"
			+ " 	AND progetto.CF_UTENTE_REFERENTE_GESTORE = :codFiscale"
			+ " 	AND	 ( :nomeProgramma IS NULL  OR   programma.NOME LIKE %:nomeProgramma% )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		   nativeQuery = true)
	public Set<String> findStatiPerReferenteGestoreProgetto(
				@Param(value = "codFiscale") String codiceFiscale,
				@Param(value = "nomeProgramma") String nomeProgrammaLike, 
				@Param(value = "policies") List<String> policies, 
				@Param(value = "stati") List<String> stati
			);

	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM "
			+ "		ente_partner ente_partner "
			+ "     INNER JOIN progetto progetto   ON progetto.ID = ente_partner.ID_PROGETTO "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE 	1=1"
			+ " 	AND ente_partner.CF_UTENTE_REFERENTE_ENTE_PARTNER = :codFiscale"
			+ " 	AND	 ( :nomeProgramma IS NULL  OR   programma.NOME LIKE %:nomeProgramma% )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		   nativeQuery = true)
	public Set<String> findStatiPerReferenteEntePartner(
				@Param(value = "codFiscale") String codiceFiscale,
				@Param(value = "nomeProgramma") String nomeProgrammaLike, 
				@Param(value = "policies") List<String> policies, 
				@Param(value = "stati") List<String> stati
			);
	
	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM programma programma "
			+ " WHERE  1=1"
			+ " 	AND programma.CF_UTENTE_DELEGATO_GESTORE = :codFiscale"
			+ " 	AND	 ( :nomeProgramma IS NULL  OR   programma.NOME LIKE %:nomeProgramma% )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		   nativeQuery = true)
	public Set<String> findStatiPerDelegatoGestoreProgramma(
				@Param(value = "codFiscale") String codiceFiscale,
				@Param(value = "nomeProgramma") String nomeProgrammaLike, 
				@Param(value = "policies") List<String> policies, 
				@Param(value = "stati") List<String> stati
			);

	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM "
			+ "		progetto progetto "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE  1=1"
			+ " 	AND progetto.CF_UTENTE_DELEGATO_GESTORE = :codFiscale"
			+ " 	AND	 ( :nomeProgramma IS NULL  OR   programma.NOME LIKE %:nomeProgramma% )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		   nativeQuery = true)
	public Set<String> findStatiPerDelegatoGestoreProgetto(
				@Param(value = "codFiscale") String codiceFiscale,
				@Param(value = "nomeProgramma") String nomeProgrammaLike, 
				@Param(value = "policies") List<String> policies, 
				@Param(value = "stati") List<String> stati
			);

	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM "
			+ "		ente_partner ente_partner "
			+ "     INNER JOIN progetto progetto   ON progetto.ID = ente_partner.ID_PROGETTO "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE 	1=1"
			+ " 	AND ente_partner.CF_UTENTE_DELEGATO_ENTE_PARTNER = :codFiscale"
			+ " 	AND	 ( :nomeProgramma IS NULL  OR   programma.NOME LIKE %:nomeProgramma% )"
			+ " 	AND  ( COALESCE(:policies) IS NULL 	OR   programma.POLICY IN (:policies) )"
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		   nativeQuery = true)
	public Set<String> findStatiPerDelegatoEntePartner(
				@Param(value = "codFiscale") String codiceFiscale,
				@Param(value = "nomeProgramma") String nomeProgrammaLike, 
				@Param(value = "policies") List<String> policies, 
				@Param(value = "stati") List<String> stati
			);
	
	@Query(value = "SELECT DISTINCT programma.STATO"
			+ " FROM "
			+ "		programma programma  "
			+ "	LEFT JOIN ente ente "
			+ "		ON programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID "
			+ " WHERE  1=1 "
			+ "		AND programma.POLICY = :policy "
		    + " 	AND	 ( :criterioRicerca IS NULL  "
		    + "			OR UPPER( programma.CODICE ) = UPPER( :criterioRicerca ) "
		    + "			OR UPPER( programma.NOME_BREVE ) LIKE UPPER( :criterioRicercaLike ) "
	        + "			OR UPPER( ente.NOME ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ " 	AND  ( COALESCE(:stati) IS NULL  	OR programma.STATO IN (:stati) )",
		   nativeQuery = true)
	public Set<String> findStatiByPolicy(
				String policy,
				@Param(value = "criterioRicerca") String criterioRicerca,
				@Param(value = "criterioRicercaLike") String criterioRicercaLike,
				@Param(value = "stati") List<String> stati
			);

	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM programma programma "
			+ " WHERE programma.CF_UTENTE_REFERENTE_GESTORE = :codFiscale",
		   nativeQuery = true)
	public Set<String> findPoliciesPerReferenteGestoreProgramma(@Param(value = "codFiscale") String codiceFiscale);

	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM "
			+ "		progetto progetto "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE progetto.CF_UTENTE_REFERENTE_GESTORE = :codFiscale",
		   nativeQuery = true)
	public Set<String> findPoliciesPerReferenteGestoreProgetto(@Param(value = "codFiscale") String codiceFiscale);

	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM "
			+ "		ente_partner ente_partner "
			+ "     INNER JOIN progetto progetto   ON progetto.ID = ente_partner.ID_PROGETTO "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE ente_partner.CF_UTENTE_REFERENTE_ENTE_PARTNER = :codFiscale",
		   nativeQuery = true)
	public Set<String> findPoliciesPerReferenteEntePartner(@Param(value = "codFiscale") String codiceFiscale);

	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM programma programma "
			+ " WHERE programma.CF_UTENTE_DELEGATO_GESTORE = :codFiscale",
		   nativeQuery = true)
	public Set<String> findPoliciesPerDelegatoGestoreProgramma(@Param(value = "codFiscale") String codiceFiscale);

	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM "
			+ "		progetto progetto "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE progetto.CF_UTENTE_DELEGATO_GESTORE = :codFiscale",
		   nativeQuery = true)
	public Set<String> findPoliciesPerDelegatoGestoreProgetto(@Param(value = "codFiscale") String codiceFiscale);

	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM "
			+ "		ente_partner ente_partner "
			+ "     RIGHT JOIN progetto progetto   ON progetto.ID = ente_partner.ID_PROGETTO "
			+ "		INNER JOIN programma programma ON programma.ID = progetto.ID_PROGRAMMA "
			+ " WHERE ente_partner.CF_UTENTE_DELEGATO_ENTE_PARTNER = :codFiscale",
		   nativeQuery = true)
	public Set<String> findPoliciesPerDelegatoEntePartner(@Param(value = "codFiscale") String codiceFiscale);

	@Query(value = "SELECT DISTINCT programma.POLICY"
			+ " FROM "
			+ "		programma programma  "
			+ " WHERE programma.POLICY = :policy",
		   nativeQuery = true)
	public Set<String> findPoliciesPerDSCU(String policy);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM programma programma "
			+ "WHERE programma.CODICE = :codice "
			+ "		AND programma.ID != :idProgramma", 
			nativeQuery = true)
	public int countProgrammiByCodice(
			@Param(value = "codice") String codice,
			@Param(value = "idProgramma") Long idProgramma);
}