package it.pa.repdgt.surveymgmt.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.ServizioEntity;

public interface ServizioSqlRepository extends JpaRepository<ServizioEntity, Long> {

	Optional<List<ServizioEntity>> findAllByDataServizioAndDurataServizioAndTipologiaServizio(Date dataServizio,
			String durataServizio, String tipologiaServizio);

	@Query(value = ""
			+ " SELECT "
			+ "		s.* "
			+ " FROM   "
			+ "		servizio s "
			+ " WHERE 1=1 "
			+ " 	AND s.id = :idServizio"
			+ " 	AND s.id_facilitatore = :idFacilitatore ", nativeQuery = true)
	Optional<ServizioEntity> findByFacilitatoreAndIdServizio(
			@Param(value = "idFacilitatore") String idFacilitatore,
			@Param(value = "idServizio") Long idServizio);

	@Query(value = ""
			+ " SELECT "
			+ "		s.* "
			+ " FROM   "
			+ "		servizio s "
			+ " 	INNER JOIN servizio_x_cittadino sxc "
			+ " 	ON s.id = sxc.id_servizio"
			+ " WHERE 1=1 "
			+ " 	AND sxc.id_servizio <> :idServizio "
			+ " 	AND sxc.id_cittadino = :idCittadino "
			+ " ORDER BY sxc.data_ora_creazione DESC"
			+ " LIMIT 1", nativeQuery = true)
	Optional<ServizioEntity> findServizioByCittadinoNotEqual(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "idCittadino") Long idCittadino);

	@Query(value = " "
			+ " SELECT          "
			+ "	DISTINCT s.* "
			+ " FROM            "
			+ "	servizio s   "
			+ "	INNER JOIN tipologia_servizio ts "
			+ "	ON ts.servizio_id = s.id"
			+ " WHERE 1=1 "
			+ "    AND (  "
			+ "		    :criterioRicercaServizio IS NULL   "
			+ "	 	 OR s.ID LIKE :criterioRicercaServizio "
			+ "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :tipologieServizi )    IS NULL OR ts.titolo IN ( :tipologieServizi ) )    "
			+ "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato   IN ( :statiServizioFiltro ) ) "
			+ " ", nativeQuery = true)
	List<ServizioEntity> findAllServiziByFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "tipologieServizi") List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro") List<String> statiServizioFiltro);

	@Query(value = " "
			+ " SELECT          "
			+ "	DISTINCT s.* "
			+ " FROM            "
			+ "	servizio s   "
			+ "	INNER JOIN progetto progetto   "
			+ "	ON progetto.ID = s.ID_PROGETTO "
			+ "	INNER JOIN programma programma "
			+ "	ON programma.ID = progetto.ID_PROGRAMMA "
			+ "	INNER JOIN tipologia_servizio ts "
			+ "	ON ts.servizio_id = s.id"
			+ " WHERE 1=1 "
			+ "    AND (  "
			+ "		    :criterioRicercaServizio IS NULL   "
			+ "	 	 OR s.ID LIKE :criterioRicercaServizio "
			+ "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :tipologieServizi )    IS NULL OR ts.titolo IN ( :tipologieServizi ) )    "
			+ "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato   IN ( :statiServizioFiltro ) ) "
			+ "    AND (  programma.POLICY = 'SCD' ) "
			+ "    ORDER BY DATA_ORA_AGGIORNAMENTO DESC", nativeQuery = true)
	List<ServizioEntity> findAllServiziByPolicySCDAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "tipologieServizi") List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro") List<String> statiServizioFiltro);

	@Query(value = " "
			+ " SELECT          "
			+ "	DISTINCT s.* "
			+ " FROM            "
			+ "	servizio s   "
			+ "	INNER JOIN ente_sede_progetto_facilitatore espf   "
			+ "	ON espf.ID_FACILITATORE = s.ID_FACILITATORE       "
			+ "	INNER JOIN progetto progetto   "
			+ "	ON progetto.ID = s.ID_PROGETTO "
			+ "	INNER JOIN programma programma "
			+ "	ON programma.ID = progetto.ID_PROGRAMMA"
			+ "	INNER JOIN tipologia_servizio ts "
			+ "	ON ts.servizio_id = s.id"
			+ " WHERE 1=1 "
			+ "    AND ( UPPER( espf.ID_FACILITATORE ) = UPPER( :codiceFiscaleUtente ) ) "
			+ "    AND (  "
			+ "		    :criterioRicercaServizio IS NULL   "
			+ "	 	 OR s.ID LIKE :criterioRicercaServizio "
			+ "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )       "
			+ "    AND ( COALESCE( :idsProgettoFiltro   ) IS NULL OR progetto.ID  IN ( :idsProgettoFiltro  ) )       "
			+ "    AND ( COALESCE( :tipologieServizi )    IS NULL OR ts.titolo    IN ( :tipologieServizi ) )         "
			+ "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato      IN ( :statiServizioFiltro ) )      "
			+ "    AND  s.ID_ENTE = :idEnte"
			+ "    ORDER BY s.DATA_ORA_AGGIORNAMENTO DESC", nativeQuery = true)
	List<ServizioEntity> findAllServiziByFacilitatoreOVolontarioAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "idsProgrammaFiltro") List<String> idsProgrammaFiltro,
			@Param(value = "idsProgettoFiltro") List<String> idsProgettoFiltro,
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "tipologieServizi") List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro") List<String> statiServizioFiltro,
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente);

	@Query(value = " "
			+ " SELECT          "
			+ "	DISTINCT s.* "
			+ " FROM            "
			+ "	servizio s   "
			+ "	INNER JOIN progetto progetto            "
			+ "	ON progetto.ID = s.ID_PROGETTO          "
			+ "	INNER JOIN programma programma          "
			+ "	ON programma.ID = progetto.ID_PROGRAMMA "
			+ "	INNER JOIN referente_delegati_gestore_programma rdgp "
			+ "	ON rdgp.ID_PROGRAMMA = programma.ID AND rdgp.ID_ENTE = programma.ID_ENTE_GESTORE_PROGRAMMA "
			+ "	INNER JOIN tipologia_servizio ts "
			+ "	ON ts.servizio_id = s.id"
			+ " WHERE 1=1 "
			+ "    AND (  "
			+ "		    :criterioRicercaServizio IS NULL   "
			+ "	 	 OR s.ID LIKE :criterioRicercaServizio "
			+ "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )  "
			+ "    AND ( COALESCE( :tipologieServizi )    IS NULL OR ts.titolo    IN ( :tipologieServizi ) )    "
			+ "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato      IN ( :statiServizioFiltro ) ) "
			+ "    ORDER BY s.DATA_ORA_AGGIORNAMENTO DESC", nativeQuery = true)
	List<ServizioEntity> findAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "idsProgrammaFiltro") List<String> idsProgrammaFiltro,
			@Param(value = "tipologieServizi") List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro") List<String> statiServizioFiltro);

	@Query(value = " "
			+ " SELECT                            "
			+ "	DISTINCT s.*                   "
			+ " FROM                              "
			+ "	servizio s                     "
			+ "	INNER JOIN progetto progetto   "
			+ "	ON progetto.ID = s.ID_PROGETTO "
			+ "	INNER JOIN programma programma "
			+ "	ON programma.ID = progetto.ID_PROGRAMMA "
			+ "	INNER JOIN referente_delegati_gestore_progetto rdgp "
			+ "	ON rdgp.ID_PROGETTO = progetto.ID AND rdgp.ID_ENTE = progetto.ID_ENTE_GESTORE_PROGETTO "
			+ "	INNER JOIN tipologia_servizio ts "
			+ "	ON ts.servizio_id = s.id"
			+ " WHERE 1=1 "
			+ "    AND (  "
			+ "		    :criterioRicercaServizio IS NULL   "
			+ "	 	 OR s.ID LIKE :criterioRicercaServizio "
			+ "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )  "
			+ "    AND ( COALESCE( :idsProgettoFiltro   ) IS NULL OR progetto.ID  IN ( :idsProgettoFiltro  ) )  "
			+ "    AND ( COALESCE( :tipologieServizi )    IS NULL OR ts.titolo    IN ( :tipologieServizi ) )    "
			+ "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato      IN ( :statiServizioFiltro ) ) "
			+ "    ORDER BY s.DATA_ORA_AGGIORNAMENTO DESC", nativeQuery = true)
	List<ServizioEntity> findAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "idsProgrammaFiltro") List<String> idsProgrammaFiltro,
			@Param(value = "idsProgettoFiltro") List<String> idsProgettoFiltro,
			@Param(value = "tipologieServizi") List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro") List<String> statiServizioFiltro);

	@Query(value = " "
			+ " SELECT          "
			+ "	DISTINCT s.* "
			+ " FROM            "
			+ "	servizio s   "
			+ "	INNER JOIN progetto progetto   "
			+ "	ON progetto.ID = s.ID_PROGETTO "
			+ "	INNER JOIN programma programma "
			+ "	ON programma.ID = progetto.ID_PROGRAMMA    "
			+ "	INNER JOIN referente_delegati_partner rdgp "
			+ "	ON rdgp.ID_PROGETTO = progetto.ID"
			+ "	INNER JOIN tipologia_servizio ts "
			+ "	ON ts.servizio_id = s.id"
			+ " WHERE 1=1 "
			+ "    AND (  "
			+ "		    :criterioRicercaServizio IS NULL   "
			+ "	 	 OR s.ID LIKE :criterioRicercaServizio "
			+ "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
			+ "    ) "
			+ "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )  "
			+ "    AND ( COALESCE( :idsProgettoFiltro   ) IS NULL OR progetto.ID  IN ( :idsProgettoFiltro  ) )  "
			+ "    AND ( COALESCE( :tipologieServizi )    IS NULL OR ts.titolo    IN ( :tipologieServizi ) )    "
			+ "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato      IN ( :statiServizioFiltro ) ) "
			+ "    AND rdgp.ID_ENTE = :idEnte"
			+ "    ORDER BY s.DATA_ORA_AGGIORNAMENTO DESC", nativeQuery = true)
	List<ServizioEntity> findAllServiziByReferenteODelegatoEntePartnerAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio,
			@Param(value = "idsProgrammaFiltro") List<String> idsProgrammaFiltro,
			@Param(value = "idsProgettoFiltro") List<String> idsProgettoFiltro,
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "tipologieServizi") List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro") List<String> statiServizioFiltro);

	@Query(value = " "
			+ " SELECT          "
			+ "	CONCAT(u.cognome, ' ', u.nome) as nominativoFacilitatore "
			+ " FROM            "
			+ "	servizio s   "
			+ "	INNER JOIN utente u "
			+ "	ON u.codice_fiscale = s.id_facilitatore      "
			+ " WHERE 1=1 "
			+ "    AND s.id_facilitatore = :idFacilitatore "
			+ "	AND s.id = :idServizio"
			+ " ", nativeQuery = true)
	String findNominativoFacilitatoreByIdFacilitatoreAndIdServizio(
			@Param(value = "idFacilitatore") String idFacilitatore,
			@Param(value = "idServizio") Long idServizio);

	Optional<ServizioEntity> findByNome(String nomeServizio);

	@Query(value = " "
			+ " SELECT          "
			+ "	s.*"
			+ " FROM            "
			+ "	servizio s   "
			+ " WHERE 1=1 "
			+ "    AND s.id <> :idServizio "
			+ "	AND s.nome = :nomeServizio"
			+ " ", nativeQuery = true)
	Optional<ServizioEntity> findByNomeUpdate(@Param(value = "nomeServizio") String nomeServizio,
			@Param(value = "idServizio") Long idServizio);

	@Query(value = "SELECT DISTINCT "
			+ "			s.id_sede "
			+ "		FROM "
			+ "			servizio s "
			+ "		INNER JOIN servizio_x_cittadino sxc"
			+ "			ON sxc.id_servizio = s.id"
			+ "		WHERE "
			+ "			s.id_facilitatore = :codiceFiscaleUtente "
			+ "		AND "
			+ "			s.id_progetto = :idProgetto "
			+ "		AND "
			+ "			s.id_ente = :idEnte ", nativeQuery = true)
	List<String> findIdsSediFacilitatoreConServiziAndCittadiniCensitiByCodFiscaleAndIdProgettoAndIdEnte(
			@Param("codiceFiscaleUtente") String codiceFiscaleUtenteLoggato,
			@Param("idProgetto") Long idProgetto,
			@Param("idEnte") Long idEnte);

	@Query(value = ""
			+ "		SELECT "
			+ "			count(*) "
			+ "		FROM "
			+ "			servizio s "
			+ "		WHERE 1=1"
			+ "			AND s.id = :idServizio"
			+ "			AND s.id_progetto = :idProgetto "
			+ "			AND s.id_ente = :idEnte "
			+ "			AND s.id_facilitatore = :cfUtenteLoggato ", nativeQuery = true)
	int isServizioAssociatoAUtenteProgettoEnte(
			@Param("idServizio") Long idServizio,
			@Param("idProgetto") Long idProgetto,
			@Param("idEnte") Long idEnte,
			@Param("cfUtenteLoggato") String cfUtenteLoggato);

	@Query(value = ""
			+ "		SELECT "
			+ "			count(*) "
			+ "		FROM "
			+ "			servizio s "
			+ "		WHERE 1=1"
			+ "			AND s.id = :idServizio"
			+ "			AND s.id_progetto = :idProgetto ", nativeQuery = true)
	int isServizioAssociatoARegpDegp(
			@Param("idServizio") Long idServizio,
			@Param("idProgetto") Long idProgetto);

	@Query(value = ""
			+ "		SELECT "
			+ "			count(*) "
			+ "		FROM "
			+ "			servizio s "
			+ "		WHERE 1=1"
			+ "			AND s.id = :idServizio"
			+ "			AND s.id_progetto = :idProgetto "
			+ "			AND s.id_ente = :idEnte "
			+ "", nativeQuery = true)
	int isServizioAssociatoAReppDepp(
			@Param("idServizio") Long idServizio,
			@Param("idProgetto") Long idProgetto,
			@Param("idEnte") Long idEnte);

	@Query(value = ""
			+ " select * "
			+ "from servizio s "
			+ "inner join questionario_compilato qc "
			+ "on s.id = qc.servizio_id "
			+ "where qc.id = :idQuestionarioCompilato", nativeQuery = true)
	Optional<ServizioEntity> findServizioByQuestionarioCompilato(
			@Param(value = "idQuestionarioCompilato") String idQuestionarioCompilato);

	boolean existsByIdAndIdEnteSedeProgettoFacilitatore(Long idServizio,
			EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey);


	Optional<List<ServizioEntity>> findAllByDataServizioAndDurataServizioAndTipologiaServizioAndIdEnteSedeProgettoFacilitatore(Date dataServizio,
		String durataServizio, String tipologiaServizio, EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey);
}