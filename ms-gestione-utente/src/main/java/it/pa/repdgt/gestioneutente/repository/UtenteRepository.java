package it.pa.repdgt.gestioneutente.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.UtenteEntity;

@Repository
public interface UtenteRepository extends JpaRepository<UtenteEntity, Long> { 

//	@Query(value = "SELECT * FROM UENTE WHERE codiceFiscale = :codiceFiscale", nativeQuery = true)
//	@Query(value = "SELECT u FROM UtenteEntity u WHERE u.codiceFiscale = :codiceFiscale ")
//	public UtenteEntity findByCodiceFiscale(String codiceFiscale);
	
	public Optional<UtenteEntity> findByCodiceFiscale(String codiceFiscaleUtente);
	
	@Query(value = "SELECT utente FROM UtenteEntity utente WHERE utente.codiceFiscale = :theCodiceFiscale")
	public UtenteEntity findUtenteEagerByCodiceFiscale(@Param(value = "theCodiceFiscale") String theCodiceFiscale);
	
	@Query(value = " "
				 + " SELECT "
				 + "	*   "
				 + " FROM   "
				 + "	utente utente "
				 + " 	LEFT JOIN utente_x_ruolo ur "
				 + "	ON utente.CODICE_FISCALE = ur.UTENTE_ID "
				 + " 	LEFT JOIN ruolo ruolo "
				 + "	ON ruolo.CODICE = ur.RUOLO_CODICE "
				 + " WHERE 1=1 "
				 + " 	AND	(     :criterioRicerca IS NULL  "
		         + "		   OR CONVERT( utente.ID, CHAR ) = :criterioRicerca "
		         + "	       OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
	             + "		   OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
	             + "		   OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) "
	             + "	) "
 			     + "	AND  ( COALESCE(:ruoli) IS NULL 		   OR   ruolo.NOME IN (:ruoli) ) " ,
			nativeQuery = true)
	public Set<UtenteEntity> findByFilter(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,
			@Param(value = "ruoli") List<String> ruoli
	);

	
	@Query(value = "SELECT * " 
			+ "FROM ( "
			+ "SELECT rdg.CF_UTENTE, rdg.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_programma  rdg "
			+ "	INNER JOIN programma programma "
			+ "		ON rdg.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD'  "
			+ " "
			+ "  UNION  "
			+ " "
			+ "SELECT rdgp.CF_UTENTE, rdgp.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	INNER JOIN progetto progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "	INNER JOIN programma programma "
			+ " 	ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD'  "
			+ " "
			+ "  UNION  "
			+ " "
			+ "SELECT rdp.CF_UTENTE, rdp.CODICE_RUOLO "
			+ "	FROM referente_delegati_partner rdp "
			+ "	INNER JOIN ente_partner ep "
			+ "		ON rdp.ID_PROGETTO = ep.ID_PROGETTO "
			+ "	INNER JOIN progetto progetto "
			+ "		ON ep.ID_PROGETTO = progetto.ID "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD' ) "
			+ "AS utenti  "
			+ "	  INNER JOIN utente utente "
			+ "	  ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	  INNER JOIN utente_x_ruolo ur "
			+ "	  ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	  INNER JOIN ruolo ruolo   "
			+ "	  ON ruolo.CODICE = ur.RUOLO_CODICE  "
			+ "WHERE 1=1 "
			+ " 	AND	(    :criterioRicerca IS NULL   "
	        + "		  	  OR CONVERT( utente.ID, CHAR ) = :criterioRicerca  "
	        + "	    	  OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike )  "
            + "			  OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike )  "
            + "			  OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike )  "
            + "		) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public Set<UtenteEntity> findUtentiPerDSCU(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT * "
			+ "FROM ( "
			+ "SELECT rdg.CF_UTENTE, rdg.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "		AND rdg.CF_UTENTE != :cfUtente "
			+ "UNION "
			+ "SELECT rdgp.CF_UTENTE, rdgp.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	INNER JOIN progetto progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "	WHERE progetto.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT rdp.CF_UTENTE, rdp.CODICE_RUOLO "
			+ "	FROM referente_delegati_partner rdp "
			+ "	INNER JOIN ente_partner ep "
			+ "		ON rdp.ID_PROGETTO = ep.ID_PROGETTO "
			+ "	INNER JOIN progetto progetto "
			+ "		ON ep.ID_PROGETTO = progetto.ID "
			+ "	WHERE progetto.ID_PROGRAMMA = :idProgramma ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ", 
			nativeQuery = true)
	public Set<UtenteEntity> findUtentiPerReferenteDelegatoGestoreProgramma(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "cfUtente")String cfUtente,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT * "
			+ "FROM ( "
			+ "SELECT rdg.CF_UTENTE, rdg.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT rdgp.CF_UTENTE, rdgp.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	WHERE rdgp.CF_UTENTE != :cfUtente "
			+ "		AND rdgp.ID_PROGETTO = :idProgetto "
			+ "UNION "
			+ "SELECT rdp.CF_UTENTE, rdp.CODICE_RUOLO "
			+ "	FROM referente_delegati_partner rdp "
			+ "	WHERE rdp.ID_PROGETTO = :idProgetto ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ", 
			nativeQuery = true)
	public Set<UtenteEntity> findUtentiPerReferenteDelegatoGestoreProgetti(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "cfUtente")String cfUtente, 
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT * "
			+ "FROM ( "
			+ "SELECT rdg.CF_UTENTE, rdg.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT rdgp.CF_UTENTE, rdgp.CODICE_RUOLO "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ " WHERE rdgp.ID_PROGETTO = :idProgetto "
			+ "UNION "
			+ "SELECT rdp.CF_UTENTE, rdp.CODICE_RUOLO "
			+ "	FROM referente_delegati_partner rdp "
			+ "	WHERE rdp.CF_UTENTE != :cfUtente "
			+ "		AND rdp.ID_PROGETTO = :idProgetto ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public Set<UtenteEntity> findUtentiPerReferenteDelegatoEntePartnerProgetti(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "cfUtente")String cfUtente, 
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT utenti.STATO_UTENTE " 
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE, rdg.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	INNER JOIN programma programma "
			+ "		ON rdg.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD' "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE, rdgp.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	INNER JOIN progetto progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "	INNER JOIN programma programma "
			+ " 	ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD' "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE, rdp.STATO_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	INNER JOIN ente_partner ep "
			+ "		ON rdp.ID_PROGETTO = ep.ID_PROGETTO "
			+ "	INNER JOIN progetto progetto "
			+ "		ON ep.ID_PROGETTO = progetto.ID "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD' ) "
			+ "AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public List<String> findStatiByPolicy(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT utenti.STATO_UTENTE "
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE, rdg.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "		AND rdg.CF_UTENTE != :cfUtente "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE, rdgp.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	INNER JOIN progetto progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "	WHERE progetto.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE, rdp.STATO_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	INNER JOIN ente_partner ep "
			+ "		ON rdp.ID_PROGETTO = ep.ID_PROGETTO "
			+ "	INNER JOIN progetto progetto "
			+ "		ON ep.ID_PROGETTO = progetto.ID "
			+ "	WHERE progetto.ID_PROGRAMMA = :idProgramma ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ", 
			nativeQuery = true)
	public List<String> findStatiPerReferenteDelegatoGestoreProgramma(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "cfUtente")String cfUtente,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT utenti.STATO_UTENTE "
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE, rdg.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE, rdgp.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	WHERE rdgp.CF_UTENTE != :cfUtente "
			+ "		AND rdgp.ID_PROGETTO = :idProgetto "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE, rdp.STATO_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	WHERE rdp.ID_PROGETTO = :idProgetto ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public List<String> findStatiPerReferenteDelegatoGestoreProgetti(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "cfUtente")String cfUtente, 
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT utenti.STATO_UTENTE "
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE, rdg.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE, rdgp.STATO_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	WHERE rdgp.ID_PROGETTO = :idProgetto "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE, rdp.STATO_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	WHERE rdp.CF_UTENTE != :cfUtente "
			+ "		AND rdp.ID_PROGETTO = :idProgetto ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public List<String> findStatiPerReferenteDelegatoEntePartnerProgetti(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "cfUtente")String cfUtente, 
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = ""
			+ " SELECT DISTINCT ruolo.NOME "
			+ " FROM "
			+ "		utente "
			+ " 	INNER JOIN utente_x_ruolo ur "
			+ "		ON utente.CODICE_FISCALE = ur.UTENTE_ID "
			+ " 	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ " WHERE 1=1 "
			+ " 	AND	(    :criterioRicerca IS NULL  "
	        + "			  OR CONVERT( utente.ID, CHAR ) = :criterioRicerca "
	        + "	    	  OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			  OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			  OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) "
            + "		) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
		nativeQuery = true)
	public List<String> findAllRuoli(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,  
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT ruolo.NOME " 
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	INNER JOIN programma programma "
			+ "		ON rdg.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD' "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	INNER JOIN progetto progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "	INNER JOIN programma programma "
			+ " 	ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD' "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	INNER JOIN ente_partner ep "
			+ "		ON rdp.ID_PROGETTO = ep.ID_PROGETTO "
			+ "	INNER JOIN progetto progetto "
			+ "		ON ep.ID_PROGETTO = progetto.ID "
			+ "	INNER JOIN programma programma "
			+ "		ON progetto.ID_PROGRAMMA = programma.ID "
			+ "	WHERE programma.POLICY = 'SCD' ) "
			+ "AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public List<String> findRuoliPerDSCU(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike,  
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT ruolo.NOME "
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "		AND rdg.CF_UTENTE != :cfUtente "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	INNER JOIN progetto progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "	WHERE progetto.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	INNER JOIN ente_partner ep "
			+ "		ON rdp.ID_PROGETTO = ep.ID_PROGETTO "
			+ "	INNER JOIN progetto progetto "
			+ "		ON ep.ID_PROGETTO = progetto.ID "
			+ "	WHERE progetto.ID_PROGRAMMA = :idProgramma ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public List<String> findRuoliPerReferenteDelegatoGestoreProgramma(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "cfUtente")String cfUtente,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT ruolo.NOME "
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	WHERE rdgp.CF_UTENTE != :cfUtente "
			+ "		AND rdgp.ID_progetto = :idProgetto "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	WHERE rdp.ID_PROGETTO = :idProgetto ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public List<String> findRuoliPerReferenteDelegatoGestoreProgetti(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "cfUtente")String cfUtente,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = "SELECT DISTINCT ruolo.NOME "
			+ "FROM ( "
			+ "SELECT DISTINCT rdg.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_programma rdg "
			+ "	WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "UNION "
			+ "SELECT DISTINCT rdgp.CF_UTENTE "
			+ "	FROM referente_delegati_gestore_progetto rdgp "
			+ "	WHERE rdgp.ID_PROGETTO = :idProgetto "
			+ "UNION "
			+ "SELECT DISTINCT rdp.CF_UTENTE "
			+ "	FROM referente_delegati_partner rdp "
			+ "	WHERE rdp.CF_UTENTE != :cfUtente "
			+ "		AND rdp.ID_PROGETTO = :idProgetto ) "
			+ "	AS utenti "
			+ "	INNER JOIN utente utente "
			+ "		ON utenti.CF_UTENTE = utente.CODICE_FISCALE "
			+ "	INNER JOIN utente_x_ruolo ur "
			+ "		ON ur.UTENTE_ID = utente.CODICE_FISCALE "
			+ "	INNER JOIN ruolo ruolo "
			+ "		ON ruolo.CODICE = ur.RUOLO_CODICE "
			+ "	WHERE 1 = 1 "
			+ " 	AND	 ( :criterioRicerca IS NULL  "
	        + "			OR CONVERT(utente.ID, CHAR) = :criterioRicerca "
	        + "	    	OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) ) "
			+ "		AND  ( COALESCE(:ruolo) IS NULL 		   OR   ruolo.NOME IN (:ruolo) ) "
			+ "		AND  ( COALESCE(:stato) IS NULL 		   OR   utente.STATO  IN (:stato) ) ",
			nativeQuery = true)
	public List<String> findRuoliPerReferenteDelegatoEntePartnerProgetti(
			@Param(value = "idProgramma") Long idProgramma, 
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "cfUtente")String cfUtente,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike, 
			@Param(value = "ruolo") List<String> ruolo,
			@Param(value = "stato")  List<String> stato
	);

	@Query(value = ""
			+ " SELECT "
			+ "		*  "
			+ " FROM   "
			+ "		utente "
			+ "	WHERE 1=1  "
			+ "		AND (   "
			+ "			   CONVERT( utente.ID, CHAR ) = :criterioRicerca ) "
		    + "	    	   OR UPPER( utente.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			   OR UPPER( utente.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "			   OR UPPER( utente.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike "
            + "		) ", 
			nativeQuery = true)
	public List<UtenteEntity> findUtenteByCriterioRicerca(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "criterioRicercaLike") String criterioRicercaLike
	);

	public Optional<UtenteEntity> findByEmailAndCodiceFiscaleNot(String email, String codiceFiscale);

}