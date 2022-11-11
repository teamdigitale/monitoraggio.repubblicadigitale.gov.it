package it.pa.repdgt.ente.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.ente.entity.projection.AllEntiProjection;
import it.pa.repdgt.ente.entity.projection.EnteProjection;
import it.pa.repdgt.shared.entity.EnteEntity;

@Repository
public interface EnteRepository extends JpaRepository<EnteEntity, Long> { 
	
	public Optional<EnteEntity> findByNome(String nomeEnte);
	
	public Optional<EnteEntity> findByNomeAndIdNot(String nomeEnte, Long id);
	
	@Query(value = "SELECT ente FROM EnteEntity ente WHERE ente.piva = :partitaIva")
	public Optional<EnteEntity> findByPartitaIva(@Param(value="partitaIva") String partitaIva);

	
	@Query(value = "SELECT e FROM EnteEntity e WHERE e.id = :theId")
	public Optional<EnteEntity> findEnteLightById(@Param(value="theId") Long id);


	@Query(value = ""
				+" SELECT "
				+"    enti.ID_ENTE as idEnte"
				+"   ,enti.NOME_ENTE as nomeEnte"
				+"	 ,enti.TIPOLOGIA_ENTE as tipologiaEnte"
				+"	 ,enti.PROFILO_ENTE as profiloEnte"
				+ "  ,enti.IDP as idp"
				+" FROM ( "
				+" 		SELECT DISTINCT "
				+"		   e.PARTITA_IVA "
				+" 	      ,e.ID as ID_ENTE "
				+" 	      ,e.NOME as NOME_ENTE "
				+" 		  ,e.TIPOLOGIA as TIPOLOGIA_ENTE"
				+" 		  ,'ENTE GESTORE DI PROGRAMMA' AS PROFILO_ENTE "
				+" 		  ,prgm.POLICY "
				+ "       ,prgm.id as IDP"
				+" 	 	FROM "
				+" 			ente e "
				+" 			INNER JOIN programma prgm "
				+" 			ON e.ID = prgm.ID_ENTE_GESTORE_PROGRAMMA "
				+"      	LEFT JOIN progetto prgt "
				+"          ON prgt.ID_PROGRAMMA = prgm.ID "
				+"      WHERE 1=1 "
				+" 		  AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
				+"  	  AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
				+" 									"
				+" 			UNION 					"
				+" 									"
				+" 		SELECT DISTINCT " 
				+"		   e.PARTITA_IVA "
				+" 	      ,e.ID as ID_ENTE "
				+" 	      ,e.NOME as NOME_ENTE "
				+" 		  ,e.TIPOLOGIA as TIPOLOGIA_ENTE"
				+" 		  ,'ENTE GESTORE DI PROGETTO' AS PROFILO_ENTE "
				+" 		  ,prgm.POLICY "
				+ "		  ,prgt.id as IDP"
				+" 		FROM "
				+" 			ente e "
				+" 			INNER JOIN progetto prgt "
				+" 			ON e.ID = prgt.ID_ENTE_GESTORE_PROGETTO "
				+" 			INNER JOIN programma prgm "
				+" 			ON prgm.ID = prgt.ID_PROGRAMMA "
				+" 		WHERE 1=1 "
				+"  		AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
				+"  		AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
				+" 									"
				+" 			UNION 					"
				+" 									"
				+" 		SELECT DISTINCT "
				+ "		   e.PARTITA_IVA "
				+" 	      ,e.ID as ID_ENTE "
				+" 	      ,e.NOME as NOME_ENTE "
				+" 		  ,e.TIPOLOGIA as TIPOLOGIA_ENTE"
				+" 		  ,'ENTE PARTNER' AS PROFILO_ENTE "
				+" 		  ,prgm.POLICY "
				+ "       ,prgt.id as IDP"
				+" 		FROM "
				+" 			ente_partner ep "
				+" 			INNER JOIN ente e "
				+" 			ON e.ID = ep.ID_ENTE "
				+" 			INNER JOIN progetto prgt "
				+" 	 		ON prgt.ID = ep.ID_PROGETTO "
				+" 			INNER JOIN programma prgm "
				+" 			ON prgm.ID = prgt.ID_PROGRAMMA "
				+" 		WHERE 1=1 "
				+" 	 		AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
				+"  		AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
				+" ) AS enti "
				+" WHERE 1=1 "
				+"		AND ( :policy IS NULL    OR   enti.POLICY = :policy ) "
				+" 		AND (     :criterioRicerca IS NULL  "
		        +"			   OR CONVERT( enti.ID_ENTE, CHAR ) = :criterioRicerca "
		        +"	    	   OR UPPER( enti.NOME_ENTE ) LIKE UPPER( :criterioRicercaLike ) "
	            +"		  	   OR UPPER( enti.PARTITA_IVA ) = UPPER( :criterioRicerca ) "
	            +"	    ) "
				+" 		AND  ( COALESCE(:profiliEnte) IS NULL  OR enti.PROFILO_ENTE IN (:profiliEnte) ) "
				+" ORDER BY enti.NOME_ENTE",
			nativeQuery = true)
	public List<AllEntiProjection> findAllEntiFiltrati(
		@Param("criterioRicerca") String criterioRicerca,
		@Param("criterioRicercaLike") String criterioRicercaLike, 
		@Param("idsProgrammi") List<String> idsProgrammi,
		@Param("idsProgetti")  List<String> idsProgetti,
		@Param("profiliEnte")  List<String> profiliEnte,
		@Param("policy") String policy
	);
	
	@Query(value = ""
			+ " SELECT DISTINCT"
			+"	  programmi.ID_PROGRAMMA "
			+"	 ,programmi.NOME_PROGRAMMA "
			+" FROM ( "
			+" 		SELECT DISTINCT    "
			+"		   e.ID as ID_ENTE "
			+"		  ,e.PARTITA_IVA as PARTITA_IVA_ENTE "
			+" 		  ,prgm.ID as ID_PROGRAMMA "
			+" 		  ,prgm.NOME_BREVE as NOME_PROGRAMMA "	
			+" 	      ,e.NOME as NOME_ENTE "
			+" 		  ,'ENTE GESTORE DI PROGRAMMA' AS PROFILO_ENTE "
			+" 		  ,prgm.POLICY "				
			+" 	 	FROM "
			+" 			ente e "
			+" 			INNER JOIN programma prgm "
			+" 			ON e.ID = prgm.ID_ENTE_GESTORE_PROGRAMMA "
			+"      	LEFT JOIN progetto prgt "
			+"          ON prgt.ID_PROGRAMMA = prgm.ID "
			+"      WHERE 1=1 "
			+" 		  AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
			+"  	  AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
			+" 									"
			+" 			UNION 					"
			+" 									"
			+" 		SELECT DISTINCT    " 
			+"		   e.ID as ID_ENTE "
			+"		  ,e.PARTITA_IVA as PARTITA_IVA_ENTE "
			+" 		  ,prgm.ID as ID_PROGRAMMA "
			+" 		  ,prgm.NOME_BREVE as NOME_PROGRAMMA "
			+" 	      ,e.NOME as NOME_ENTE "
			+" 		  ,'ENTE GESTORE DI PROGETTO' AS PROFILO_ENTE "
			+" 		  ,prgm.POLICY "
			+" 		FROM "
			+" 			ente e "
			+" 			INNER JOIN progetto prgt "
			+" 			ON e.ID = prgt.ID_ENTE_GESTORE_PROGETTO "
			+" 			INNER JOIN programma prgm "
			+" 			ON prgm.ID = prgt.ID_PROGRAMMA "
			+" 		WHERE 1=1 "
			+"  			AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
			+"  			AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
			+" 									"
			+" 			UNION 					"
			+" 									"
			+" 		SELECT DISTINCT    "
			+"		   e.ID as ID_ENTE "
			+"		  ,e.PARTITA_IVA as PARTITA_IVA_ENTE "
			+" 		  ,prgm.ID as ID_PROGRAMMA "
			+" 		  ,prgm.NOME_BREVE as NOME_PROGRAMMA "	
			+" 	      ,e.NOME as NOME_ENTE "
			+" 		  ,'ENTE PARTNER' AS PROFILO_ENTE "
			+" 		  ,prgm.POLICY "
			+" 		FROM "
			+" 			ente_partner ep "
			+" 			INNER JOIN ente e "
			+" 			ON e.ID = ep.ID_ENTE "
			+" 			INNER JOIN progetto prgt "
			+" 	 		ON prgt.ID = ep.ID_PROGETTO "
			+" 			INNER JOIN programma prgm "
			+" 			ON prgm.ID = prgt.ID_PROGRAMMA "
			+" 		WHERE 1=1 "
			+" 	 		AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
			+"  		AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
			+" ) AS programmi "
			+" WHERE 1=1 "
			+"		AND	( :policy IS NULL    OR   programmi.POLICY = :policy ) "
			+"	 	AND	(     :criterioRicerca IS NULL  "
	        +"			   OR CONVERT( programmi.ID_ENTE, CHAR ) = :criterioRicerca "
	        +"	    	   OR UPPER( programmi.NOME_ENTE ) LIKE UPPER( :criterioRicercaLike ) "
            +"			   OR UPPER( programmi.PARTITA_IVA_ENTE ) LIKE UPPER( :criterioRicercaLike ) "
            + "	    ) "
			+" 		AND ( COALESCE(:profiliEnte) IS NULL  OR programmi.PROFILO_ENTE IN (:profiliEnte) ) ",
			nativeQuery = true)
	public List<Map<String, String>> findAllProgrammiFiltrati(
		@Param("criterioRicerca") String criterioRicerca,
		@Param("criterioRicercaLike") String criterioRicercaLike, 
		@Param("idsProgrammi") List<String> idsProgrammi,
		@Param("idsProgetti")  List<String> idsProgetti,
		@Param("profiliEnte")  List<String> profiliEnte,
		@Param("policy") String policy
	);
	
	@Query(value = ""
			+ " SELECT DISTINCT"
			+"	  progetti.ID_PROGETTO "
			+"	 ,progetti.NOME_PROGETTO "
			+" FROM ( "
			+" 		SELECT DISTINCT    "
			+"		   e.ID as ID_ENTE "
			+"		  ,e.PARTITA_IVA as PARTITA_IVA_ENTE "
			+" 		  ,prgt.ID as ID_PROGETTO "
			+" 		  ,prgt.NOME_BREVE as NOME_PROGETTO "	
			+" 	      ,e.NOME as NOME_ENTE "
			+" 		  ,'ENTE GESTORE DI PROGRAMMA' AS PROFILO_ENTE "
			+" 		  ,prgm.POLICY "				
			+" 	 	FROM "
			+" 			ente e "
			+" 			INNER JOIN programma prgm "
			+" 			ON e.ID = prgm.ID_ENTE_GESTORE_PROGRAMMA "
			+"      	LEFT JOIN progetto prgt "
			+"          ON prgt.ID_PROGRAMMA = prgm.ID "
			+"      WHERE 1=1 "
			+" 		  AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
			+"  	  AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
			+" 									"
			+" 			UNION 					"
			+" 									"
			+" 		SELECT DISTINCT    " 
			+"		   e.ID as ID_ENTE "
			+"		  ,e.PARTITA_IVA as PARTITA_IVA_ENTE "
			+" 		  ,prgt.ID as ID_PROGETTO "
			+" 		  ,prgt.NOME_BREVE as NOME_PROGETTO "
			+" 	      ,e.NOME as NOME_ENTE "
			+" 		  ,'ENTE GESTORE DI PROGETTO' AS PROFILO_ENTE "
			+" 		  ,prgm.POLICY "
			+" 		FROM "
			+" 			ente e "
			+" 			INNER JOIN progetto prgt "
			+" 			ON e.ID = prgt.ID_ENTE_GESTORE_PROGETTO "
			+" 			INNER JOIN programma prgm "
			+" 			ON prgm.ID = prgt.ID_PROGRAMMA "
			+" 		WHERE 1=1"
			+"  		AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) ) "
			+"  		AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )  "
			+" 									"
			+" 			UNION 					"
			+" 									"
			+" 		SELECT DISTINCT    "
			+"		   e.ID as ID_ENTE "
			+"		  ,e.PARTITA_IVA as PARTITA_IVA_ENTE "
			+" 		  ,prgt.ID as ID_PROGETTO "
			+" 		  ,prgt.NOME_BREVE as NOME_PROGETTO "
			+" 	      ,e.NOME as NOME_ENTE "
			+" 		  ,'ENTE PARTNER' AS PROFILO_ENTE "
			+" 		  ,prgm.POLICY "
			+" 		FROM "
			+" 			ente_partner ep "
			+" 			INNER JOIN ente e "
			+" 			ON e.ID = ep.ID_ENTE "
			+" 			INNER JOIN progetto prgt "
			+" 	 		ON prgt.ID = ep.ID_PROGETTO "
			+" 			INNER JOIN programma prgm "
			+" 			ON prgm.ID = prgt.ID_PROGRAMMA "
			+" 		WHERE 1=1 "
			+" 	 		AND ( COALESCE(:idsProgrammi) IS NULL  OR prgm.ID IN (:idsProgrammi) )"
			+"  		AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )"
			+" ) AS progetti "
			+" WHERE 1=1 "
			+"		AND	 ( :policy IS NULL  OR  progetti.POLICY = :policy ) "
			+" 		AND	 (     :criterioRicerca IS NULL  "
	        +"			    OR CONVERT( progetti.ID_ENTE, CHAR ) = :criterioRicerca "
	        +"	    		OR UPPER( progetti.NOME_ENTE ) LIKE UPPER( :criterioRicercaLike ) "
            +"				OR UPPER( progetti.PARTITA_IVA_ENTE ) LIKE UPPER( :criterioRicercaLike ) "
            +"		) "
			+" 		AND  ( COALESCE(:profiliEnte) IS NULL  OR  progetti.PROFILO_ENTE IN (:profiliEnte) ) ",
			nativeQuery = true)
	public List<Map<String, String>> findAllProgettiFiltrati(
		@Param("criterioRicerca") String criterioRicerca,
		@Param("criterioRicercaLike") String criterioRicercaLike, 
		@Param("idsProgrammi") List<String> idsProgrammi,
		@Param("idsProgetti")  List<String> idsProgetti,
		@Param("profiliEnte")  List<String> profiliEnte,
		@Param("policy") String policy
	);
	
	

	@Query(value = " SELECT "
			+"			prgt.ID "
			+"       FROM "
			+"			progetto prgt "
			+"			INNER JOIN referente_delegati_gestore_progetto rdgp "
			+"			ON prgt.ID = rdgp.ID_PROGETTO "
			+"			INNER JOIN utente u "
			+"			ON u.CODICE_FISCALE = rdgp.CF_UTENTE "
			+"		 WHERE 1=1 "
			+"			AND rdgp.CODICE_RUOLO  =  :codiceRuolo "
			+"			AND u.CODICE_FISCALE   =  :cfUtente "
			+"			AND prgt.ID_PROGRAMMA  =  :idProgramma "
			+"  		AND ( COALESCE(:idsProgetti) IS NULL  OR  prgt.ID IN (:idsProgetti) )",
			nativeQuery = true)
	public List<String> findIdProgettiByRuoloAndIdProgramma(
		String codiceRuolo, 
		String cfUtente, 
		String idProgramma, 
		List<String> idsProgetti
	);

	@Query(value = " SELECT "
			+"			prgt.ID"
			+"       FROM "
			+"			progetto prgt "
			+"			INNER JOIN referente_delegati_partner rdp "
			+"			ON prgt.ID = rdp.ID_PROGETTO "
			+"			INNER JOIN utente u "
			+"			ON u.CODICE_FISCALE = rdp.CF_UTENTE "
			+"		 WHERE 1=1 "
			+"			AND rdp.CODICE_RUOLO  =  :codiceRuolo "
			+"			AND u.CODICE_FISCALE  =  :cfUtente "
			+"			AND prgt.ID_PROGRAMMA =  :idProgramma "
			+"  		AND ( COALESCE(:idsProgetti)  IS NULL  OR prgt.ID IN (:idsProgetti) )",
			nativeQuery = true)
	public List<String> findIdProgettiEntePartnerByRuoloAndIdProgramma(
		String codiceRuolo, 
		String cfUtente,
		String idProgramma, 
		List<String> idsProgetti
	);
	
	@Query(value = " "
			+" SELECT"
			+" 		 programma.id AS ID_PROGRAMMA"
			+" 		,programma.nome as NOME_PROGRAMMA"
			+" FROM"
			+" 		programma programma"
			+" WHERE 1=1"
			+" 	 	AND programma.id = :idProgramma",
			nativeQuery = true)
	public List<Map<String, String>> findProgrammaById(@Param("idProgramma") Long idProgramma);

	@Query(value =" SELECT "
				 +" 	 ente.ID as id "
				 +"	,ente.NOME as nome "
				 +"	,ente.NOME_BREVE as nomeBreve "
				 +"	,ente.PARTITA_IVA as partitaIva"
				 +"	,ente.TIPOLOGIA as tipologia "
				 +"	,ente.SEDE_LEGALE as sedeLegale "
				 +"	,ente.INDIRIZZO_PEC as indirizzoPec "
				 + ",programma.STATO_GESTORE_PROGRAMMA as statoEnte"
				 +"	,'Gestore di Programma' as profilo "
				 +" FROM "
				 +"	ente ente "
				 +"	INNER JOIN programma programma "
				 +"	ON programma.ID_ENTE_GESTORE_PROGRAMMA = ente.ID"
				 +" WHERE programma.ID = :idProgramma", 
		   nativeQuery = true)
	public Optional<EnteProjection> findEnteGestoreProgrammaByIdProgramma(@Param("idProgramma") Long idProgramma);


	@Query(value = " SELECT "
			 +" 	 ente.ID as id "
			 +"	,ente.NOME as nome "
			 +"	,ente.NOME_BREVE as nomeBreve "
			 +"	,ente.PARTITA_IVA as partitaIva"
			 +"	,ente.TIPOLOGIA as tipologia "
			 +"	,ente.SEDE_LEGALE as sedeLegale "
			 +"	,ente.INDIRIZZO_PEC as indirizzoPec "
			 + ",progetto.STATO_GESTORE_PROGETTO as statoEnte"
			 +"	,'Gestore di Progetto' as profilo "
			 +" FROM "
			 +"	ente ente "
			 +"	INNER JOIN progetto progetto "
			 +"	ON progetto.ID_ENTE_GESTORE_PROGETTO = ente.ID"
			 +" WHERE progetto.ID = :idProgetto", 
	  nativeQuery = true)
	public Optional<EnteProjection> findEnteGestoreProgettoByIdProgetto(@Param("idProgetto") Long idProgetto);

	@Query(value = "SELECT * "
			+ "			FROM ente e "
			+ "		WHERE   "
			+ "			CONVERT( e.ID, CHAR ) = :criterioRicerca "
			+ "			OR UPPER( e.NOME ) LIKE UPPER( :criterioRicercaLike ) "
			+ "			OR UPPER( e.PARTITA_IVA ) = UPPER( :criterioRicerca ) "
			+ "     ORDER BY nome",
			nativeQuery = true)
	public List<EnteEntity> findByCriterioRicerca(String criterioRicerca, String criterioRicercaLike);

	@Query(value = "SELECT * "
			+ "			FROM ente e "
			+ "		WHERE   "
			+ "			e.partita_iva = :partitaIva"
			+ "			AND e.id <> :idEnte",
			nativeQuery = true)
	public Optional<EnteEntity> findByPartitaIvaAndIdDiverso(String partitaIva, Long idEnte);
}