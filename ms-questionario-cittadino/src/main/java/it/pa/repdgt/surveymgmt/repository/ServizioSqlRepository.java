package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.ServizioEntity;

public interface ServizioSqlRepository extends JpaRepository<ServizioEntity, Long> {

	@Query(value = ""
			+ " SELECT "
			+ "	s.* "
			+ " FROM   "
			+ "	servizio s "
			+ " INNER JOIN servizio_x_cittadino sxc "
			+ " ON s.id = sxc.id_servizio"
			+ " WHERE 1=1 "
			+ " AND sxc.id_servizio <> :idServizio "
			+ " AND sxc.id_cittadino = :idCittadino "
			+ " ORDER BY sxc.data_ora_creazione DESC"
			+ " LIMIT 1",
			nativeQuery = true)
	Optional<ServizioEntity> findServizioByCittadinoNotEqual(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "idCittadino") Long idCittadino
			);
	
	@Query(value = " "
			 + " SELECT          "
			 + "	DISTINCT s.* "
			 + " FROM            "
			 + "	servizio s   "
			 + " WHERE 1=1 "
			 + "    AND (  "
			 + "		    :criterioRicercaServizio IS NULL   "	
		     + "	 	 OR s.ID LIKE :criterioRicercaServizio "
		     + "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         + "    AND ( COALESCE( :tipologieServizi )    IS NULL OR s.tipologia_servizio IN ( :tipologieServizi ) ) "
	         + "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato IN ( :statiServizioFiltro ) )           "
	         + " ",
			 nativeQuery = true)
	List<ServizioEntity> findAllServiziByFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio, 
			@Param(value = "tipologieServizi")        List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro")     List<String> statiServizioFiltro
		);

	@Query(value = " "
			 + " SELECT          "
			 + "	DISTINCT s.* "
			 + " FROM            "
			 + "	servizio s   "
			 + "	INNER JOIN progetto progetto   "
			 + "	ON progetto.ID = s.ID_PROGETTO "
			 + "	INNER JOIN programma programma "
			 + "	ON programma.ID = progetto.ID_PROGRAMMA "
			 + " WHERE 1=1 "
			 + "    AND (  "
			 + "		    :criterioRicercaServizio IS NULL   "	
		     + "	 	 OR s.ID LIKE :criterioRicercaServizio "
		     + "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         + "    AND ( COALESCE( :tipologieServizi )    IS NULL OR s.tipologia_servizio IN ( :tipologieServizi ) ) "
	         + "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato IN ( :statiServizioFiltro ) )           "
	         + "    AND (  programma.POLICY = 'SCD' ) "
	         + " ",
			 nativeQuery = true)
	List<ServizioEntity> findAllServiziByPolicySCDAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio, 
			@Param(value = "tipologieServizi")        List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro")     List<String> statiServizioFiltro
		);

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
			 + " WHERE 1=1 "
			 + "    AND ( UPPER( espf.ID_FACILITATORE ) = UPPER( :codiceFiscaleUtente ) ) "
			 + "    AND (  "
			 + "		    :criterioRicercaServizio IS NULL   "	
		     + "	 	 OR s.ID LIKE :criterioRicercaServizio "
		     + "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         + "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )       "
	         + "    AND ( COALESCE( :idsProgettoFiltro   ) IS NULL OR progetto.ID  IN ( :idsProgettoFiltro  ) )       "
	         + "    AND ( COALESCE( :tipologieServizi )    IS NULL OR s.tipologia_servizio IN ( :tipologieServizi ) ) "
	         + "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato IN ( :statiServizioFiltro ) )           "
	         + " ",
			 nativeQuery = true)
	List<ServizioEntity> findAllServiziByFacilitatoreOVolontarioAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio, 
			@Param(value = "idsProgrammaFiltro")      List<String> idsProgrammaFiltro, 
			@Param(value = "idsProgettoFiltro")       List<String> idsProgettoFiltro, 
			@Param(value = "statiServizioFiltro")     List<String> statiServizioFiltro,
			@Param(value = "tipologieServizi")        List<String> tipologieServizi,
			@Param(value = "codiceFiscaleUtente")     String codiceFiscaleUtente
		);


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
			 + " WHERE 1=1 "
			 + "    AND (  "
			 + "		    :criterioRicercaServizio IS NULL   "	
		     + "	 	 OR s.ID LIKE :criterioRicercaServizio "
		     + "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         + "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )       "
	         + "    AND ( COALESCE( :tipologieServizi )    IS NULL OR s.tipologia_servizio IN ( :tipologieServizi ) ) "
	         + "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato IN ( :statiServizioFiltro ) )           "
	         + " ",
			 nativeQuery = true)
	List<ServizioEntity> findAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio, 
			@Param(value = "idsProgrammaFiltro")      List<String> idsProgrammaFiltro, 
			@Param(value = "tipologieServizi")        List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro")     List<String> statiServizioFiltro
		);
	
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
			 + " WHERE 1=1 "
			 + "    AND (  "
			 + "		    :criterioRicercaServizio IS NULL   "	
		     + "	 	 OR s.ID LIKE :criterioRicercaServizio "
		     + "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         + "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )       "
	         + "    AND ( COALESCE( :idsProgettoFiltro   ) IS NULL OR progetto.ID  IN ( :idsProgettoFiltro  ) )       "
	         + "    AND ( COALESCE( :tipologieServizi )    IS NULL OR s.tipologia_servizio IN ( :tipologieServizi ) ) "
	         + "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato IN ( :statiServizioFiltro ) )           "
	         + " ",
			 nativeQuery = true)
	List<ServizioEntity> findAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio, 
			@Param(value = "idsProgrammaFiltro")      List<String> idsProgrammaFiltro, 
			@Param(value = "idsProgettoFiltro")       List<String> idsProgettoFiltro, 
			@Param(value = "tipologieServizi")        List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro")     List<String> statiServizioFiltro
		);

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
			 + " WHERE 1=1 "
			 + "    AND (  "
			 + "		    :criterioRicercaServizio IS NULL   "	
		     + "	 	 OR s.ID LIKE :criterioRicercaServizio "
		     + "	   	 OR UPPER(s.NOME) LIKE UPPER( :criterioRicercaServizio ) "
	         + "    ) "
	         + "    AND ( COALESCE( :idsProgrammaFiltro  ) IS NULL OR programma.ID IN ( :idsProgrammaFiltro ) )       "
	         + "    AND ( COALESCE( :idsProgettoFiltro   ) IS NULL OR progetto.ID  IN ( :idsProgettoFiltro  ) )       "
	         + "    AND ( COALESCE( :tipologieServizi )    IS NULL OR s.tipologia_servizio IN ( :tipologieServizi ) ) "
	         + "    AND ( COALESCE( :statiServizioFiltro ) IS NULL OR s.stato IN ( :statiServizioFiltro ) )           "
	         + " ",
			 nativeQuery = true)
	List<ServizioEntity> findAllServiziByReferenteODelegatoEntePartnerAndFiltro(
			@Param(value = "criterioRicercaServizio") String criterioRicercaServizio, 
			@Param(value = "idsProgrammaFiltro")      List<String> idsProgrammaFiltro, 
			@Param(value = "idsProgettoFiltro")       List<String> idsProgettoFiltro, 
			@Param(value = "tipologieServizi")        List<String> tipologieServizi,
			@Param(value = "statiServizioFiltro")     List<String> statiServizioFiltro
		);

}