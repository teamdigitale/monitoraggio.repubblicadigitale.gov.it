package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import it.pa.repdgt.surveymgmt.projection.GetCittadinoProjection;

public interface CittadinoServizioRepository extends JpaRepository<CittadinoEntity, Long> {
	@Query(value = " "
			 + " SELECT "
			 + "	DISTINCT c.id as idCittadino,"
			 + "			 c.nome,"
			 + "			 c.cognome,"
			 + "			 c.codice_fiscale as codiceFiscale,"
			 + "			 c.num_documento as numeroDocumento,"
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
		     + "	   	 OR UPPER(c.NOME) LIKE UPPER( :criterioRicercaServizioLike ) "
		     + "		 OR UPPER(c.COGNOME) LIKE UPPER( :criterioRicercaServizioLike ) "
		     + "         OR concat(UPPER( c.COGNOME ), ' ' , UPPER( c.NOME ))  = UPPER(:criterioRicercaServizio) "
		     + "		 OR UPPER(c.NUM_DOCUMENTO) = UPPER( :criterioRicercaServizio ) "
		     + "		 OR UPPER(c.codice_fiscale) = UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         + "    AND ( COALESCE( :statiQuestionariFiltro  ) IS NULL OR q_c.STATO IN ( :statiQuestionariFiltro ) ) "
	         + "	LIMIT :currPage, :pageSize",
			 nativeQuery = true)
	List<CittadinoServizioProjection> findAllCittadiniServizioPaginatiByFiltro(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "criterioRicercaServizioLike") String criterioRicercaServizioLike, 
			@Param(value = "statiQuestionariFiltro") List<String> statiQuestionariFiltro,
			@Param(value = "currPage") Integer currPage,
			@Param(value = "pageSize") Integer pageSize
		);
	
	@Query(value = " SELECT "
			+ "	DISTINCT c.id as idCittadino,"
			+ "			 c.nome,"
			+ "			 c.cognome,"
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
			+ "	   	 OR UPPER(c.NOME) LIKE UPPER( :criterioRicercaServizioLike ) "
			+ "		 OR UPPER(c.COGNOME) LIKE UPPER( :criterioRicercaServizioLike ) "
			+ "		 OR UPPER(c.NUM_DOCUMENTO) = UPPER( :criterioRicercaServizio ) "
			+ "		 OR UPPER(c.codice_fiscale) = UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :statiQuestionariFiltro  ) IS NULL OR q_c.STATO IN ( :statiQuestionariFiltro ) ) ",
			nativeQuery = true)
	List<CittadinoServizioProjection> findAllCittadiniServizioByFiltro(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "criterioRicercaServizioLike") String criterioRicercaServizioLike, 
			@Param(value = "statiQuestionariFiltro") List<String> statiQuestionariFiltro
		);
	
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
		     + "	   	 OR UPPER(c.NOME) LIKE UPPER( :criterioRicercaServizioLike ) "
		     + "		 OR UPPER(c.COGNOME) LIKE UPPER( :criterioRicercaServizioLike ) "
		     + "		 OR UPPER(c.NUM_DOCUMENTO) = UPPER( :criterioRicercaServizio ) "
		     + "		 OR UPPER(c.codice_fiscale) = UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         ,
			 nativeQuery = true)
	List<String> getAllStatiQuestionarioCittadinoServizioDropdown(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "criterioRicercaServizioLike") String criterioRicercaServizioLike
			);

	@Query(value = "    "
			+ " SELECT  "
			+ "		id, "
			+ "		codice_fiscale as codiceFiscale, "
			+ "		nome,      "
			+ "		cognome,   "
			+ "		email,     "
			+ "		telefono,  "
			+ "		prefisso,  "
			+ "		numero_di_cellulare as cellulare,  "
			+ "		num_documento as numeroDocumento   "
			+ " FROM          "
			+ "		cittadino "
			+ " WHERE 1=1     "
			+ "		AND ((UPPER(:tipoDocumento) = 'CF' AND UPPER(codice_fiscale) = UPPER(:criterioRicerca))       "
			+ " 	OR (UPPER(:tipoDocumento) = 'NUM_DOC' AND UPPER(num_documento) LIKE UPPER(:criterioRicerca))) ",
			 nativeQuery = true)
	List<GetCittadinoProjection> getAllCittadiniByCodFiscOrNumDoc(@Param(value = "tipoDocumento") String tipoDocumento,
			@Param(value = "criterioRicerca") String criterioRicerca);
}