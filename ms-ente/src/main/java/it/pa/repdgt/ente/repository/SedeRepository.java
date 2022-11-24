package it.pa.repdgt.ente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.ente.entity.projection.FasciaOrariaAperturaIndirizzoSedeProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.shared.entity.SedeEntity;

public interface SedeRepository extends JpaRepository<SedeEntity, Long> { 
	
	@Query(value = " SELECT "
				 + "	sede "
				 + " FROM"
				 + "	SedeEntity sede "
				 + " WHERE UPPER(sede.nome) LIKE %:nomeSede%"
				 + " order by sede.nome",
			nativeQuery = false)	
	List<SedeEntity> findSedeByNomeSedeLike(@Param(value = "nomeSede") String nomeSede);
	
	@Query(value = ""
				 + " SELECT "
				 + "	s "
				 + " FROM "
				 + "	SedeEntity s "
				 + " WHERE s.nome = :nomeSede "
		   ,nativeQuery = false)
	Optional<SedeEntity> findSedeByNomeSede(@Param(value ="nomeSede") String nomeSede);
	
	@Query(value = ""
			+ " SELECT "
			+ "	s "
			+ " FROM "
			+ "	SedeEntity s "
			+ " WHERE id <> :idSede "
			+ " AND s.nome = :nomeSede "
			,nativeQuery = false)
	Optional<SedeEntity> findSedeByNomeSedeAndNotIdSede(
			@Param(value ="nomeSede") String nomeSede,
			@Param(value ="idSede") Long idSede);
	
	@Query(value = " SELECT "
				 + "		esp.STATO_SEDE "
			 	 + " FROM "
				 + "		ente_sede_progetto esp "
				 + " WHERE 1=1"
				 + "		AND esp.ID_PROGETTO = :idProgetto "
				 + "		AND esp.ID_SEDE = :idSede "
				 + "		AND esp.ID_ENTE = :idEnte ", 
			nativeQuery = true)
	public String findStatoSedeByIdProgettoAndIdSedeAndIdEnte(
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "idSede") Long idSede,
			@Param(value = "idEnte") Long idEnte
	);

	@Query(value = " "
			+ " SELECT "
			 + "	 u.ID "
			 + "	,u.NOME "
			 + "	,u.COGNOME "
			 + "	,espf.STATO_UTENTE as stato "
			 + "	,u.CODICE_FISCALE as codiceFiscale "
			 + "    ,case when ("
			 + "          :codiceRuoloUtente in ('REG', 'DEG', 'FAC', 'VOL') OR"
			 + "          :ruoloEnte = 'Gestore' AND :codiceRuoloUtente in ('REPP', 'DEPP') OR"
			 + "          :ruoloEnte = 'Partner' AND :codiceRuoloUtente in ('REGP', 'DEGP')"
			 + "     )"
			 + "     then 'false' "
			 + "     else 'true' end as associatoAUtente"
			 + " FROM "
			 + "	ente_sede_progetto_facilitatore espf"
			 + "    INNER JOIN utente u"
			 + "	ON u.CODICE_FISCALE = espf.ID_FACILITATORE"
			 + " WHERE 1=1 " 
			 + "	AND espf.ID_PROGETTO = :idProgetto "
			 + "	AND espf.ID_ENTE = :idEnte "
			 + "	AND espf.ID_SEDE = :idSede ",
			nativeQuery = true)
	List<UtenteProjection> findFacilitatoriSedeByIdProgettoAndIdEnteAndIdSede(
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "idSede") Long idSede,
			@Param(value = "codiceRuoloUtente") String codiceRuoloUtente,
			@Param(value = "ruoloEnte") String ruoloEnte
	);
	
	@Query(value = " SELECT "
				 + "		s.*"
				 + "  FROM "
				 + "		ente_sede_progetto esp"
				 + "    	INNER JOIN sede s"
				 + "	 	ON s.ID = esp.ID_SEDE"
				 + "  WHERE 1=1 "
				 + "	 	AND esp.ID_PROGETTO = :idProgetto"
				 + "	 	AND esp.ID_ENTE = :idEnte",
	   nativeQuery = true)
	List<SedeEntity> findSediEnteByIdProgettoAndIdEnte(
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "idEnte")	 Long idEnte
		);
	
	@Query(value = " "
			 + " SELECT "
			 + "	 sede.ID 			as idSede "
			 + "	,ind_sede.VIA 		as via "
			 + "	,ind_sede.CIVICO 	as civico "
			 + "	,ind_sede.COMUNE 	as comune "
			 + "	,ind_sede.PROVINCIA as provincia "
			 + "	,ind_sede.CAP 		as cap "
			 + "	,ind_sede.NAZIONE 	as nazione"
			 + "    ,ind_sede_fasce_orarie.GIORNO_APERTURA as giornoAperturaSede "
			 + "	,ind_sede_fasce_orarie.ORARIO_APERTURA as orarioAperturaSede "
			 + "    ,ind_sede_fasce_orarie.ORARIO_CHIUSURA as orarioChiusuraSede "
			 + " FROM"
			 + "	sede sede "
			 + "	INNER JOIN indirizzo_sede ind_sede "
			 + "	ON ind_sede.SEDE_ID = sede.ID "
			 + "	INNER JOIN indirizzo_sede_fascia_oraria ind_sede_fasce_orarie "
			 + "	ON ind_sede_fasce_orarie.INDIRZZO_SEDE_ID = ind_sede.ID "
			 + " WHERE 1=1"
			 + "	AND sede.id = :idSede",
	nativeQuery = true)	
	List<FasciaOrariaAperturaIndirizzoSedeProjection> findFasceOrarieIndirizzoSedeByIdSede(
			@Param(value = "idSede") Long idSede
		);
}