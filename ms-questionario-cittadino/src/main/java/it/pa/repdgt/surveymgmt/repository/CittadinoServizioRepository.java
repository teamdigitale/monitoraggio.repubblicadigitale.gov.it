package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import it.pa.repdgt.surveymgmt.projection.GetCittadinoProjection;

public interface CittadinoServizioRepository extends JpaRepository<CittadinoEntity, Long> {
	@Query(value = "SELECT DISTINCT c.id as idCittadino, c.codice_fiscale as codiceFiscale, q_c.data_ora_aggiornamento as dataUltimoAggiornamento, c.num_documento as numeroDocumento, q_c.id as idQuestionario, q_c.stato as statoQuestionario FROM servizio s INNER JOIN servizio_x_cittadino s_x_c ON s.ID = s_x_c.id_servizio INNER JOIN cittadino c ON s_x_c.id_cittadino = c.id LEFT JOIN questionario_compilato q_c ON q_c.servizio_id = s.id AND q_c.id_cittadino = c.id WHERE 1=1 AND s.id = :idServizio AND ( :criterioRicercaServizio IS NULL OR UPPER(c.NUM_DOCUMENTO) = UPPER( :criterioRicercaServizio ) OR UPPER(c.codice_fiscale) = UPPER( :criterioRicercaServizio ) ) AND ( COALESCE( :statiQuestionariFiltro ) IS NULL OR q_c.STATO IN ( :statiQuestionariFiltro ) ) ORDER BY dataUltimoAggiornamento DESC", nativeQuery = true)
	List<CittadinoServizioProjection> findAllCittadiniServizioPaginatiByFiltro(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "statiQuestionariFiltro") List<String> statiQuestionariFiltro);

	@Query(value = " SELECT "
			+ "	DISTINCT c.id as idCittadino,"
			+ "			 c.codice_fiscale as codiceFiscale,"
			+ "			 q_c.id as idQuestionario,"
			+ "			 q_c.stato as statoQuestionario"
			+ " FROM "
			+ "	servizio s "
			+ "	INNER JOIN servizio_x_cittadino s_x_c   "
			+ "	ON s.ID = s_x_c.id_servizio "
			+ "	INNER JOIN cittadino c "
			+ "	ON s_x_c.id_cittadino = c.id"
			+ "	LEFT JOIN questionario_compilato q_c"
			+ "	ON q_c.servizio_id = s.id"
			+ "	AND q_c.id_cittadino = c.id"
			+ " WHERE 1=1 "
			+ "    AND s.id = :idServizio"
			+ "    AND ( "
			+ "		    :criterioRicercaServizio IS NULL  "
			+ "		 OR UPPER(c.NUM_DOCUMENTO) = UPPER( :criterioRicercaServizio ) "
			+ "		 OR UPPER(c.codice_fiscale) = UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :statiQuestionariFiltro  ) IS NULL OR q_c.STATO IN ( :statiQuestionariFiltro ) ) ", nativeQuery = true)
	List<CittadinoServizioProjection> findAllCittadiniServizioByFiltro(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "statiQuestionariFiltro") List<String> statiQuestionariFiltro);

	@Query(value = " SELECT "
			+ "	DISTINCT q_c.STATO"
			+ " FROM "
			+ "	servizio s "
			+ "	INNER JOIN servizio_x_cittadino s_x_c   "
			+ "	ON s.ID = s_x_c.id_servizio "
			+ "	INNER JOIN cittadino c "
			+ "	ON s_x_c.id_cittadino = c.id"
			+ "	INNER JOIN questionario_compilato q_c"
			+ "	ON q_c.servizio_id = s.id"
			+ "	AND q_c.id_cittadino = c.id"
			+ " WHERE 1=1 "
			+ "    AND s.id = :idServizio"
			+ "    AND ( "
			+ "		    :criterioRicercaServizio IS NULL  "
			+ "		 OR UPPER(c.NUM_DOCUMENTO) = UPPER( :criterioRicercaServizio ) "
			+ "		 OR UPPER(c.codice_fiscale) = UPPER( :criterioRicercaServizio ) "
			+ "    ) ", nativeQuery = true)
	List<String> getAllStatiQuestionarioCittadinoServizioDropdown(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio);

	@Query(value = "    "
			+ " SELECT  "
			+ "		id, "
			+ "		codice_fiscale as codiceFiscale, "
			+ "		num_documento as numeroDocumento, genere as genere, fascia_di_eta_id as fasciaDiEta, titolo_di_Studio as titoloStudio, occupazione as statoOccupazionale, cittadinanza as cittadinanza, provincia_di_domicilio as provinciaDiDomicilio  "
			+ " FROM          "
			+ "		cittadino "
			+ " WHERE 1=1     "
			+ "		AND ((UPPER(:tipoDocumento) = 'CF' AND UPPER(codice_fiscale) = UPPER(:criterioRicerca))       "
			+ " 	OR (UPPER(:tipoDocumento) = 'NUM_DOC' AND UPPER(num_documento) = UPPER(:criterioRicerca))) "
			+ " ORDER BY codice_fiscale", nativeQuery = true)
	List<GetCittadinoProjection> getAllCittadiniByCodFiscOrNumDoc(@Param(value = "tipoDocumento") String tipoDocumento,
			@Param(value = "criterioRicerca") String criterioRicerca);
}