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

	@Query(value = "SELECT cit.id AS id, cit.data_ora_aggiornamento AS dataUltimoAggiornamento, cit.codice_fiscale AS codiceFiscale, COUNT(DISTINCT qc_servizi.servizio_id) AS numeroServizi, COUNT(DISTINCT CASE WHEN qc_quest_compilati.stato = 'COMPILATO' AND qc_quest_compilati.id_facilitatore = :codiceFiscaleUtenteLoggato THEN qc_quest_compilati.id END) AS numeroQuestionariCompilati FROM cittadino cit LEFT JOIN (SELECT qc.id_cittadino, qc.data_ora_aggiornamento, qc.servizio_id, MAX(qc.stato) AS stato FROM questionario_compilato qc INNER JOIN servizio s ON qc.servizio_id = s.id WHERE s.id_facilitatore = :codiceFiscaleUtenteLoggato AND (COALESCE(:idsSedi) IS NULL OR s.id_sede IN (:idsSedi)) GROUP BY qc.id_cittadino, qc.data_ora_aggiornamento, qc.servizio_id) qc_servizi ON cit.id = qc_servizi.id_cittadino LEFT JOIN (SELECT qc.id_cittadino, qc.id, MAX(qc.stato) AS stato, s.id_facilitatore FROM questionario_compilato qc INNER JOIN servizio s ON qc.servizio_id = s.id WHERE qc.stato = 'COMPILATO' AND qc.servizio_id IN (SELECT id FROM servizio WHERE id_facilitatore = :codiceFiscaleUtenteLoggato) GROUP BY qc.id_cittadino, qc.id, s.id_facilitatore) qc_quest_compilati ON cit.id = qc_quest_compilati.id_cittadino WHERE (:criterioRicerca IS NULL OR UPPER(cit.codice_fiscale) = UPPER(:criterioRicerca) OR UPPER(cit.num_documento) = UPPER(:criterioRicerca)) GROUP BY cit.id, cit.data_ora_aggiornamento, cit.codice_fiscale HAVING numeroServizi >= 1 ORDER BY dataUltimoAggiornamento DESC",
			nativeQuery = true)
	List<CittadinoProjection> findAllCittadiniByFiltro(
			@Param("criterioRicerca") 		String criterioRicerca,
			@Param("idsSedi") 				List<String> idsSedi,
			@Param("codiceFiscaleUtenteLoggato") String codiceFiscaleUtenteLoggato
		);

	@Query(value = "SELECT cittadini.conteggio_id from (SELECT DISTINCT qc_cittadino.id_cittadino as id,qc_cittadino.codice_fiscale as codiceFiscale,count_servizi.conteggio as numeroServizi,count_quest_compilati.conteggio as numeroQuestionariCompilati,count(qc_cittadino.id_cittadino) as conteggio_id FROM (SELECT DISTINCT qc.id_cittadino,c.codice_fiscale,c.num_documento,count(qc.id_cittadino) FROM questionario_compilato qc INNER JOIN cittadino c ON c.id=qc.id_cittadino INNER JOIN servizio s ON qc.servizio_id=s.id WHERE s.id_facilitatore=:codiceFiscaleUtenteLoggato AND COALESCE(:idsSedi) IS NULL OR sede_id IN (:idsSedi)) AS qc_cittadino INNER JOIN (SELECT id_cittadino,count(servizio_id) as conteggio FROM questionario_compilato WHERE 1=1 GROUP BY id_cittadino) AS count_servizi ON count_servizi.id_cittadino=qc_cittadino.id_cittadino LEFT JOIN (SELECT id_cittadino,count(*) as conteggio FROM questionario_compilato WHERE stato='COMPILATO' GROUP BY id_cittadino) AS count_quest_compilati ON count_quest_compilati.id_cittadino=qc_cittadino.id_cittadino WHERE (:criterioRicerca IS NULL OR UPPER(qc_cittadino.CODICE_FISCALE)=UPPER(:criterioRicerca) OR UPPER(qc_cittadino.NUM_DOCUMENTO)=UPPER(:criterioRicerca))) as cittadini", nativeQuery = true)
	Integer conteggioCittadini(
			@Param("criterioRicerca") 		String criterioRicerca,
			@Param("idsSedi") 				List<String> idsSedi,
			@Param("codiceFiscaleUtenteLoggato") String codiceFiscaleUtenteLoggato
	);
	
	@Query(value = "SELECT cit.id AS id, MAX(qc_servizi.data_ora_aggiornamento) AS dataUltimoAggiornamento, cit.codice_fiscale AS codiceFiscale, COUNT(DISTINCT qc_servizi.servizio_id) AS numeroServizi, COUNT(DISTINCT CASE WHEN qc_quest_compilati.stato = 'COMPILATO' AND qc_quest_compilati.id_facilitatore = :codiceFiscaleUtenteLoggato THEN qc_quest_compilati.id END) AS numeroQuestionariCompilati FROM cittadino cit LEFT JOIN (SELECT qc.id_cittadino, qc.data_ora_aggiornamento, qc.servizio_id, MAX(qc.stato) AS stato FROM questionario_compilato qc INNER JOIN servizio s ON qc.servizio_id = s.id WHERE s.id_facilitatore = :codiceFiscaleUtenteLoggato AND (COALESCE(:idsSedi) IS NULL OR s.id_sede IN (:idsSedi)) GROUP BY qc.id_cittadino, qc.servizio_id, qc.data_ora_aggiornamento) qc_servizi ON cit.id = qc_servizi.id_cittadino LEFT JOIN (SELECT qc.id_cittadino, qc.id, MAX(qc.stato) AS stato, s.id_facilitatore, MAX(qc.data_ora_aggiornamento) AS data_ora_aggiornamento FROM questionario_compilato qc INNER JOIN servizio s ON qc.servizio_id = s.id WHERE qc.stato = 'COMPILATO' AND qc.servizio_id IN (SELECT id FROM servizio WHERE id_facilitatore = :codiceFiscaleUtenteLoggato) GROUP BY qc.id_cittadino, qc.id, s.id_facilitatore) qc_quest_compilati ON cit.id = qc_quest_compilati.id_cittadino WHERE (:criterioRicerca IS NULL OR UPPER(cit.codice_fiscale) = UPPER(:criterioRicerca) OR UPPER(cit.num_documento) = UPPER(:criterioRicerca)) GROUP BY cit.id, cit.codice_fiscale HAVING numeroServizi >= 1 ORDER BY dataUltimoAggiornamento DESC LIMIT :currPage, :pageSize",
			nativeQuery = true)
	List<CittadinoProjection> findAllCittadiniPaginatiByFiltro(
			@Param("criterioRicerca") 		String criterioRicerca,
			@Param("idsSedi") 				List<String> idsSedi,
			@Param("codiceFiscaleUtenteLoggato") String codiceFiscaleUtenteLoggato,
			@Param("currPage") 				Integer currPage,
			@Param("pageSize") 				Integer pageSize
		);

	@Query(value = "SELECT s.id as idServizio, s.nome as nomeServizio, s.id_progetto as idProgetto, s.id_facilitatore as codiceFiscaleFacilitatore, qc.id as idQuestionarioCompilato, qc.stato as statoQuestionarioCompilato, s.id_ente as idEnte,sede.nome as nomeSede, sede.provincia as provincia FROM servizio s INNER JOIN servizio_x_cittadino sxc ON s.id = sxc.id_servizio AND s.id_facilitatore = :idFacilitatore AND sxc.id_cittadino = :idCittadino LEFT JOIN sede sede ON s.id_sede = sede.id LEFT JOIN questionario_compilato qc ON qc.id_cittadino = :idCittadino AND qc.facilitatore_id  = :idFacilitatore AND sxc.id_servizio = qc.servizio_id ORDER BY s.nome"
			,nativeQuery = true)
	List<DettaglioServizioSchedaCittadinoProjection> findDettaglioServiziSchedaCittadino(
			@Param("idCittadino") Long idCittadino,
			@Param("idFacilitatore") String idFacilitatore
		);

	@Query(value = "SELECT "
			+ "       sede.provincia as provincia"
			+ "		FROM "
			+ "			questionario_compilato qc "
			+ "		INNER JOIN "
			+ "			servizio s "
			+ "		ON "
			+ "			qc.servizio_id = s.id "
			+ "		INNER JOIN "
			+ "			sede sede "
			+ "		ON "
			+ "			s.id_sede = sede.id "
			+ "		WHERE "
			+ "			qc.id_cittadino = :idCittadino "
			+ "     LIMIT 1",
			nativeQuery = true)
	String findProvinciaByIdCittadino(@Param("idCittadino") Long idCittadino);

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
				 + " ",
		   nativeQuery = true)
	String findConsensoByCodiceFiscaleCittadino(
			@Param(value = "codiceFiscaleCittadino") String codiceFiscaleCittadino
		);

	@Query(value = " "
			 + " SELECT "
			 + "	cit.TIPO_CONFERIMENTO_CONSENSO "
			 + " FROM "
			 + "	cittadino cit "
			 + " WHERE 1=1 "
			 + "	AND cit.NUM_DOCUMENTO = :numeroDocumento "
			 + " ",
	   nativeQuery = true)
	String findConsensoByNumDocumentoCittadino(
			@Param(value = "numeroDocumento") String numeroDocumento
		);

	@Query(value = " "
			 + " SELECT "
			 + "	* "
			 + " FROM "
			 + "	cittadino cit "
			 + " WHERE ( "
			 + "	 		( cit.codice_fiscale <> '' AND cit.codice_fiscale = :codiceFiscale ) "
			 + " 		OR  ( cit.num_documento <> '' AND cit.num_documento = :numeroDocumento ) "
			 + "	) "
			 + "	AND cit.id <> :id"
			 + " ",
	   nativeQuery = true)
	List<CittadinoEntity> findCittadinoByCodiceFiscaleOrNumeroDocumentoAndIdDiverso(
			@Param(value = "codiceFiscale") String codiceFiscale,
			@Param(value = "numeroDocumento") String numeroDocumento, 
			@Param(value = "id") Long id);

	@Query(value = " "
			 + " SELECT "
			 + "	count( distinct(sxc.id_cittadino) ) "
			 + " FROM "
			 + "	servizio_x_cittadino sxc "
			 + " INNER JOIN servizio s"
			 + "	ON s.id = sxc.id_servizio "
			 + " WHERE "
			 + "	 1=1"
			 + "	AND s.id_facilitatore = :cfUtenteLoggato "
			 + "	AND sxc.id_cittadino = :idCittadino "
			 + "	AND s.id_ente = :idEnte "
			 + "	AND s.id_progetto = :idProgetto "
			 + " ",
	   nativeQuery = true)
	int isCittadinoAssociatoAFacVol(
			@Param(value = "idCittadino") Long idCittadino,
			@Param(value = "cfUtenteLoggato") String cfUtenteLoggato, 
			@Param(value = "idEnte") Long idEnte, 
			@Param(value = "idProgetto") Long idProgetto);
}