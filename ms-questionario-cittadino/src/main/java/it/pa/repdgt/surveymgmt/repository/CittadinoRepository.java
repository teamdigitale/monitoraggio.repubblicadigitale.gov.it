package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.DettaglioServizioSchedaCittadinoProjection;

@Repository
public interface CittadinoRepository extends JpaRepository<CittadinoEntity, Long> {

	@Query(value = "SELECT s.id as idServizio, s.nome as nomeServizio, s.id_progetto as idProgetto, s.id_facilitatore as codiceFiscaleFacilitatore, qc.id as idQuestionarioCompilato, qc.stato as statoQuestionarioCompilato, s.id_ente as idEnte,sede.nome as nomeSede, sede.provincia as provincia FROM servizio s INNER JOIN servizio_x_cittadino sxc ON s.id = sxc.id_servizio AND s.id_facilitatore = :idFacilitatore AND sxc.id_cittadino = :idCittadino LEFT JOIN sede sede ON s.id_sede = sede.id LEFT JOIN questionario_compilato qc ON qc.id_cittadino = :idCittadino AND qc.facilitatore_id  = :idFacilitatore AND sxc.id_servizio = qc.servizio_id ORDER BY s.nome", nativeQuery = true)
	List<DettaglioServizioSchedaCittadinoProjection> findDettaglioServiziSchedaCittadino(
			@Param("idCittadino") Long idCittadino,
			@Param("idFacilitatore") String idFacilitatore);

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
			+ "     LIMIT 1", nativeQuery = true)
	String findProvinciaByIdCittadino(@Param("idCittadino") Long idCittadino);

	Optional<CittadinoEntity> findByCodiceFiscale(String codiceFiscale);

	@Query(value = "SELECT cit.* FROM cittadino cit WHERE cit.codice_fiscale = :codiceFiscale", nativeQuery= true)
	List<CittadinoEntity> findAllByCodiceFiscale(@Param(value="codiceFiscale") String codiceFiscale);

	@Query(value = " "
			+ " SELECT "
			+ "	cit.TIPO_CONFERIMENTO_CONSENSO "
			+ " FROM "
			+ "	cittadino cit "
			+ " WHERE 1=1 "
			+ "	AND cit.CODICE_FISCALE = :codiceFiscaleCittadino "
			+ " ", nativeQuery = true)
	String findConsensoByCodiceFiscaleCittadino(
			@Param(value = "codiceFiscaleCittadino") String codiceFiscaleCittadino);

	@Query(value = " "
			+ " SELECT "
			+ "	* "
			+ " FROM "
			+ "	cittadino cit "
			+ " WHERE (( cit.codice_fiscale <> '' AND cit.codice_fiscale = :codiceFiscale )) "
			+ "	AND cit.id <> :id"
			+ " ", nativeQuery = true)
	List<CittadinoEntity> findCittadinoByCodiceFiscaleOrNumeroDocumentoAndIdDiverso(
			@Param(value = "codiceFiscale") String codiceFiscale,
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
			+ " ", nativeQuery = true)
	int isCittadinoAssociatoAFacVol(
			@Param(value = "idCittadino") Long idCittadino,
			@Param(value = "cfUtenteLoggato") String cfUtenteLoggato,
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "idProgetto") Long idProgetto);

    @Query(value =
			"WITH QUESTIONARI AS (\n" +
			"    SELECT\n" +
			"        qc.id_cittadino,\n" +
			"        qc.id,\n" +
			"        qc.data_ora_aggiornamento,\n" +
			"        qc.servizio_id,\n" +
			"        s.id_facilitatore,\n" +
			"        MAX(qc.stato) AS stato\n" +
			"    FROM questionario_compilato qc\n" +
			"    JOIN servizio s ON qc.servizio_id = s.id\n" +
			"    WHERE s.id_facilitatore = :cfUtenteLoggato AND (COALESCE(:idsSedi) IS NULL OR s.id_sede IN (:idsSedi))\n" +
			"	 AND qc.ente_id = :idEnte AND qc.progetto_id = :idProgetto\n" +
			"    GROUP BY qc.id_cittadino, qc.data_ora_aggiornamento, qc.servizio_id\n" +
			")\n" +
			"SELECT\n" +
			"    cit.id AS id,\n" +
			"    cit.data_ora_aggiornamento AS dataUltimoAggiornamento,\n" +
			"    cit.codice_fiscale AS codiceFiscale,\n" +
			"    COUNT(DISTINCT QUESTIONARI.servizio_id) AS numeroServizi,\n" +
			"    COUNT(DISTINCT CASE WHEN QUESTIONARI.stato = 'COMPILATA' AND QUESTIONARI.id_facilitatore = :cfUtenteLoggato THEN QUESTIONARI.id END) AS numeroQuestionariCompilati\n" +
			"FROM cittadino cit\n" +
			"JOIN QUESTIONARI ON QUESTIONARI.id_cittadino = cit.id\n" +
			"WHERE (:criterioRicerca IS NULL OR UPPER(cit.codice_fiscale) = UPPER(:criterioRicerca))\n" +
			"GROUP BY cit.id, cit.data_ora_aggiornamento, cit.codice_fiscale\n" +
			"HAVING COUNT(DISTINCT QUESTIONARI.servizio_id) >= 1\n" +
			"ORDER BY dataUltimoAggiornamento DESC\n",
			countQuery =
			"WITH QUESTIONARI AS (\n" +
			"    SELECT\n" +
			"        qc.id_cittadino,\n" +
			"        qc.id,\n" +
			"        qc.data_ora_aggiornamento,\n" +
			"        qc.servizio_id,\n" +
			"        s.id_facilitatore,\n" +
			"        MAX(qc.stato) AS stato\n" +
			"    FROM questionario_compilato qc\n" +
			"    JOIN servizio s ON qc.servizio_id = s.id\n" +
			"    WHERE s.id_facilitatore = :cfUtenteLoggato AND (COALESCE(:idsSedi) IS NULL OR s.id_sede IN (:idsSedi))\n" +
			"	 AND qc.ente_id = :idEnte AND qc.progetto_id = :idProgetto\n" +
			"    GROUP BY qc.id_cittadino, qc.data_ora_aggiornamento, qc.servizio_id\n" +
			")\n" +
			" SELECT COUNT(*) as total FROM ( \n" +
			"SELECT\n" +
			"    cit.id AS id\n" +
			"FROM cittadino cit\n" +
			"JOIN QUESTIONARI ON QUESTIONARI.id_cittadino = cit.id\n" +
			"WHERE (:criterioRicerca IS NULL OR UPPER(cit.codice_fiscale) = UPPER(:criterioRicerca))\n" +
			"GROUP BY cit.id, cit.data_ora_aggiornamento, cit.codice_fiscale\n" +
			"HAVING COUNT(DISTINCT QUESTIONARI.servizio_id) >= 1\n" +
			") t\n",
			nativeQuery = true)
    Page<CittadinoProjection> findCittadiniByFiltro(
            @Param("criterioRicerca") String criterioRicerca,
			@Param("idProgetto") Long idProgetto,
			@Param("idEnte") Long idEnte,
            @Param("idsSedi") List<String> idsSedi,
            @Param("cfUtenteLoggato") String cfUtenteLoggato,
            Pageable pageable);
}