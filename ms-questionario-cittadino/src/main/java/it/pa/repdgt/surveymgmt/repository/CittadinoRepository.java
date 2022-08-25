package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.DettaglioServizioSchedaCittadinoProjection;

@Repository
public interface CittadinoRepository extends JpaRepository<CittadinoEntity, Long> {

	@Query(value = "SELECT DISTINCT "
			+ "          qc_cittadino.id_cittadino   	  as id "
			+ "         ,qc_cittadino.nome           	  as nome "
			+ "         ,qc_cittadino.cognome        	  as cognome "
			+ "         ,count_servizi.count       		  as numeroServizi "
			+ "         ,count_quest_compilati.count 	  as numeroQuestionariCompilati "
			+ "		FROM "
			+ "           ( SELECT DISTINCT "
			+ "                 qc.id_cittadino "
			+ "                 ,c.nome "
			+ "                 ,c.cognome "
			+ "                 ,c.codice_fiscale "
			+ "                 ,c.num_documento "
			+ "            FROM "
			+ "                 questionario_compilato qc "
			+ "                 INNER JOIN cittadino c "
			+ "                 ON c.id = qc.id_cittadino"
			+ "					INNER JOIN servizio s"
			+ "					ON qc.servizio_id = s.id"
			+ "            WHERE 1=1 "
			+ "					 AND s.id_facilitatore = :codiceFiscaleUtenteLoggato"
			+ "  	  			 AND (  "
			+ "							COALESCE(:idsSedi) IS NULL  OR sede_id IN (:idsSedi) ) "
			+ "					) AS qc_cittadino "
			+ "            INNER JOIN "
			+ "                              (SELECT "
			+ "                                        id_cittadino "
			+ "                                      , count(servizio_id) as count "
			+ "                               FROM "
			+ "                                        questionario_compilato "
			+ "                               WHERE  1=1 "
			+ "  	  						  AND      ( COALESCE(:idsSedi)  	 IS NULL  OR sede_id IN (:idsSedi) )  "
			+ "                               GROUP BY "
			+ "                                        ( id_cittadino)"
			+ "								  ) "
			+ "                      AS count_servizi "
			+ "                      ON "
			+ "                                 count_servizi.id_cittadino = qc_cittadino.id_cittadino "
			+ "           	 LEFT JOIN "
			+ "                              (SELECT "
			+ "                                        id_cittadino "
			+ "                                      , count(*) as count "
			+ "                               FROM "
			+ "                                        questionario_compilato "
			+ "                               WHERE stato = 'COMPILATO' "
			+ "  	  						  AND      ( COALESCE(:idsSedi)  	 IS NULL  OR sede_id IN (:idsSedi) )  "
			+ "                               GROUP BY "
			+ "                                        ( id_cittadino)"
			+ "								  ) "
			+ "                      AS count_quest_compilati " 
			+ "                      ON "
			+ "                                 count_quest_compilati.id_cittadino = qc_cittadino.id_cittadino "
			+ "    WHERE 1=1"
			+ " 		 AND (  :criterioRicerca IS NULL  "
	        + "			     	OR CONVERT( qc_cittadino.ID_CITTADINO, CHAR ) = :criterioRicerca "
	        + "	    	     	OR UPPER( qc_cittadino.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "		  	      	OR UPPER( qc_cittadino.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "		  	     	OR UPPER( qc_cittadino.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) "
            + "		  	      	OR UPPER( qc_cittadino.NUM_DOCUMENTO ) LIKE UPPER( :criterioRicercaLike )"
            + "			) ",
			nativeQuery = true)
	List<CittadinoProjection> findAllCittadiniByFiltro(
			@Param("criterioRicerca") 		String criterioRicerca, 
			@Param("criterioRicercaLike") 	String criterioRicercaLike, 
			@Param("idsSedi") 				List<String> idsSedi,
			@Param("codiceFiscaleUtenteLoggato") String codiceFiscaleUtenteLoggato
		);
	
	@Query(value = "SELECT DISTINCT "
			+ "          qc_cittadino.id_cittadino   	  as id "
			+ "         ,qc_cittadino.nome           	  as nome "
			+ "         ,qc_cittadino.cognome        	  as cognome "
			+ "         ,count_servizi.count       		  as numeroServizi "
			+ "         ,count_quest_compilati.count 	  as numeroQuestionariCompilati "
			+ "		FROM "
			+ "           ( SELECT DISTINCT "
			+ "                 qc.id_cittadino "
			+ "                 ,c.nome "
			+ "                 ,c.cognome "
			+ "                 ,c.codice_fiscale "
			+ "                 ,c.num_documento "
			+ "            FROM "
			+ "                 questionario_compilato qc "
			+ "                 INNER JOIN cittadino c "
			+ "                 ON c.id = qc.id_cittadino"
			+ "					INNER JOIN servizio s"
			+ "					ON qc.servizio_id = s.id"
			+ "            WHERE 1=1 "
			+ "					 AND s.id_facilitatore = :codiceFiscaleUtenteLoggato"
			+ "  	  			 AND (  "
			+ "							COALESCE(:idsSedi) IS NULL  OR sede_id IN (:idsSedi) ) "
			+ "					) AS qc_cittadino "
			+ "            INNER JOIN "
			+ "                              (SELECT "
			+ "                                        id_cittadino "
			+ "                                      , count(servizio_id) as count "
			+ "                               FROM "
			+ "                                        questionario_compilato "
			+ "                               WHERE  1=1 "
			+ "  	  						  AND      ( COALESCE(:idsSedi)  	 IS NULL  OR sede_id IN (:idsSedi) )  "
			+ "                               GROUP BY "
			+ "                                        ( id_cittadino)"
			+ "								  ) "
			+ "                      AS count_servizi "
			+ "                      ON "
			+ "                                 count_servizi.id_cittadino = qc_cittadino.id_cittadino "
			+ "           	 LEFT JOIN "
			+ "                              (SELECT "
			+ "                                        id_cittadino "
			+ "                                      , count(*) as count "
			+ "                               FROM "
			+ "                                        questionario_compilato "
			+ "                               WHERE stato = 'COMPILATO' "
			+ "  	  						  AND      ( COALESCE(:idsSedi)  	 IS NULL  OR sede_id IN (:idsSedi) )  "
			+ "                               GROUP BY "
			+ "                                        ( id_cittadino)"
			+ "								  ) "
			+ "                      AS count_quest_compilati " 
			+ "                      ON count_quest_compilati.id_cittadino = qc_cittadino.id_cittadino "
			+ "    WHERE 1=1"
			+ " 		 AND (  :criterioRicerca IS NULL  "
	        + "			     	OR CONVERT( qc_cittadino.ID_CITTADINO, CHAR ) = :criterioRicerca "
	        + "	    	     	OR UPPER( qc_cittadino.NOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "		  	      	OR UPPER( qc_cittadino.COGNOME ) LIKE UPPER( :criterioRicercaLike ) "
            + "		  	     	OR UPPER( qc_cittadino.CODICE_FISCALE ) LIKE UPPER( :criterioRicercaLike ) "
            + "		  	      	OR UPPER( qc_cittadino.NUM_DOCUMENTO ) LIKE UPPER( :criterioRicercaLike )"
            + "			) "
            + "	   LIMIT :currPage, :pageSize",
			nativeQuery = true)
	List<CittadinoProjection> findAllCittadiniPaginatiByFiltro(
			@Param("criterioRicerca") 		String criterioRicerca, 
			@Param("criterioRicercaLike") 	String criterioRicercaLike, 
			@Param("idsSedi") 				List<String> idsSedi,
			@Param("codiceFiscaleUtenteLoggato") String codiceFiscaleUtenteLoggato,
			@Param("currPage") 				Integer currPage,
			@Param("pageSize") 				Integer pageSize
		);

	@Query(value = "SELECT "
			+ "			s.id as idServizio "
			+ "		  , s.nome as nomeServizio "
			+ "		  , s.id_progetto as idProgetto "
			+ "		  , qc.facilitatore_id as codiceFiscaleFacilitatore "
			+ "		  , qc.id as idQuestionarioCompilato "
			+ "		  , qc.stato as statoQuestionarioCompilato "
			+ "		FROM "
			+ "			questionario_compilato qc "
			+ "		INNER JOIN "
			+ "			servizio s "
			+ "		ON "
			+ "			qc.servizio_id = s.id "
			+ "		WHERE "
			+ "			qc.id_cittadino = :idCittadino ",
			nativeQuery = true)
	List<DettaglioServizioSchedaCittadinoProjection> findDettaglioServiziSchedaCittadino(
			@Param("idCittadino") Long idCittadino
		);
	
	Optional<CittadinoEntity> findByCodiceFiscale(String codiceFiscale);
	
	Optional<CittadinoEntity> findByNumeroDocumento(String numeroDocumento);

	@Query(value = " "
			 	 + " SELECT "
			 	 + "	*   "
				 + " FROM   "
				 + "	cittadino cit "
				 + " WHERE 1=1 "
				 + " 	AND ("
				 + "			  (:codiceFiscale IS NOT NULL AND :codiceFiscale <> '' AND cit.CODICE_FISCALE = :codiceFiscale)"
				 + "		  OR  (:numeroDocumento IS NOT NULL AND :numeroDocumento <> '' AND cit.NUM_DOCUMENTO = :numeroDocumento)"
				 + "	)", 
		   nativeQuery=true)
	Optional<CittadinoEntity> findByCodiceFiscaleOrNumeroDocumento(
			@Param(value = "codiceFiscale")   String codiceFiscale, 
			@Param(value = "numeroDocumento") String numeroDocumento
		);

	@Query(value = " "
				 + " SELECT "
				 + "	cit.TIPO_CONFERIMENTO_CONSENSO "
				 + " FROM "
				 + "	cittadino cit "
				 + " WHERE 1=1 "
				 + "	AND cit.CODICE_FISCALE = :codiceFiscaleCittadino "
				 + "	OR  cit.NUM_DOCUMENTO = :numeroDocumento "
				 + " ",
		   nativeQuery = true)
	String findConsensoByCodiceFiscaleOrNumeroDocumento(
			@Param(value = "codiceFiscaleCittadino") String codiceFiscaleCittadino, 
			@Param(value = "numeroDocumento") String numeroDocumento);
}