package it.pa.repdgt.shared.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;

public interface BrokenAccessControlRepository extends JpaRepository<RuoloEntity, String>{

	@Query(value = "select count(*) "
			+ "FROM (  select p.id_ente_gestore_programma as id_ente  "
			+ "        from programma p "
			+ "        where p.id = :idProgramma "
			+ "		and id_ente_gestore_programma = :idEnte  "
			+ "         "
			+ "        UNION "
			+ "         "
			+ "        select id_ente_gestore_progetto as id_ente  "
			+ "        from progetto pr "
			+ "        inner join programma p "
			+ "        on p.id = pr.id_programma "
			+ "        where p.id = :idProgramma "
			+ "		and id_ente_gestore_progetto = :idEnte "
			+ "         "
			+ "        UNION "
			+ "         "
			+ "        select id_ente  "
			+ "        from ente_partner ep "
			+ "        inner join progetto pr "
			+ "        on ep.id_progetto = pr.id "
			+ "        inner join programma p "
			+ "        on p.id = pr.id_programma "
			+ "        where p.id = :idProgramma "
			+ "		and ep.id_ente = :idEnte "
			+ "         "
			+ "        ) as enti_progetto",
			nativeQuery = true)
	public int getEnteByIdProgramma(@Param(value = "idEnte") Long idEnte, 
			@Param(value = "idProgramma") Long idProgramma);

	@Query(value = "select count(*) "
			+ "FROM (  select p.id_ente_gestore_programma as id_ente  "
			+ "        from programma p "
			+ "        where p.policy = 'SCD' "
			+ "		and id_ente_gestore_programma = :idEnte  "
			+ "         "
			+ "        UNION "
			+ "         "
			+ "        select id_ente_gestore_progetto as id_ente  "
			+ "        from progetto pr "
			+ "        inner join programma p "
			+ "        on p.id = pr.id_programma "
			+ "        where p.policy = 'SCD' "
			+ "		and id_ente_gestore_progetto = :idEnte "
			+ "         "
			+ "        UNION "
			+ "         "
			+ "        select id_ente  "
			+ "        from ente_partner ep "
			+ "        inner join progetto pr "
			+ "        on ep.id_progetto = pr.id "
			+ "        inner join programma p "
			+ "        on p.id = pr.id_programma "
			+ "        where p.policy = 'SCD' "
			+ "		and id_ente = :idEnte "
			+ "         "
			+ "        ) as enti_progetto ",
			nativeQuery = true)
	public int getCountEnteByPolicy(@Param(value = "idEnte") Long idEnte);
	
	@Query(value = "select count(*) "
			+ "FROM (  select p.id_ente_gestore_programma as id_ente  "
			+ "        from programma p "
			+ "        inner join progetto pr "
			+ "        on pr.id_programma = p.id "
			+ "        where pr.id = :idProgetto "
			+ "		and id_ente_gestore_programma = :idEnte  "
			+ "         "
			+ "        UNION "
			+ "         "
			+ "        select id_ente_gestore_progetto as id_ente  "
			+ "        from progetto   "
			+ "        where id = :idProgetto "
			+ "		and id_ente_gestore_progetto = :idEnte "
			+ "         "
			+ "        UNION "
			+ "         "
			+ "        select id_ente  "
			+ "        from ente_partner   "
			+ "        where id_progetto = :idProgetto "
			+ "		and id_ente = :idEnte "
			+ "         "
			+ "        ) as enti_progetto ",
			nativeQuery = true)
	public int getEnteByIdProgetto(@Param(value = "idEnte") Long idEnte, 
			@Param(value = "idProgetto") Long idProgetto);
	
	@Query(value = "SELECT * "
			+ "FROM progetto progetto "
			+ "WHERE progetto.ID_PROGRAMMA = :idProgramma ",
			nativeQuery = true)
	public List<ProgettoEntity> findByIdProgramma(Long idProgramma);
	

	@Query(value = "select count(*) from ente_sede_progetto esp  "
			+ "inner join progetto pr on  esp.id_progetto = pr.id "
			+ "inner join programma p "
			+ "on pr.id_programma = p.id "
			+ "where esp.id_sede = :idSede "
			+ "and p.policy = 'SCD'", 
			nativeQuery = true)
	public int getCountSedeByPolicy(@Param(value = "idSede") Long idSede); 
	
	@Query(value = "select count(*) from ente_sede_progetto esp  "
			+ "inner join progetto pr on  esp.id_progetto = pr.id "
			+ "inner join programma p "
			+ "on pr.id_programma = p.id "
			+ "where esp.id_sede = :idSede "
			+ "and p.id = :idProgramma", 
			nativeQuery = true)
	public int getCountSedeByIdProgramma(@Param(value = "idSede") Long idSede, 
			@Param(value = "idProgramma") Long idProgramma); 
	
	@Query(value = "select count(*) from ente_sede_progetto  "
			+ "where id_sede = :idSede "
			+ "and id_progetto = :idProgetto", 
			nativeQuery = true)
	public int getCountSedeByIdProgetto(@Param(value = "idSede") Long idSede, 
			@Param(value = "idProgetto") Long idProgetto); 
	
	@Query(value = "select count(*) from ente_sede_progetto  "
			+ "where id_sede = :idSede "
			+ "and id_progetto = :idProgetto "
			+ "and id_ente = :idEnte", 
			nativeQuery = true)
	public int getCountSedeByIdProgettoAndEnte(@Param(value = "idSede") Long idSede, 
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "idEnte") Long idEnte);

	/**** FILTER *****/
	@Query(value = "SELECT count(*) FROM referente_delegati_gestore_programma "
			+ "where id_programma = :idProgramma "
			+ "and id_ente = :idEnte "
			+ "and cf_utente = :codiceFiscale "
			+ "and codice_ruolo = :codiceRuolo ", 
			nativeQuery = true)
	public int isRefDegProgramma(@Param(value = "codiceFiscale") String codiceFiscale, 
			@Param(value = "codiceRuolo") String codiceRuolo, 
			@Param(value = "idProgramma") String idProgramma, 
			@Param(value = "idEnte") String idEnte);

	@Query(value = "SELECT count(*) FROM referente_delegati_gestore_progetto "
			+ "where id_progetto = :idProgetto "
			+ "and id_ente = :idEnte "
			+ "and cf_utente = :codiceFiscale "
			+ "and codice_ruolo = :codiceRuolo ", 
			nativeQuery = true)
	public int isRefDegProgetto(@Param(value = "codiceFiscale") String codiceFiscale, 
			@Param(value = "codiceRuolo") String codiceRuolo, 
			@Param(value = "idProgetto") String idProgetto, 
			@Param(value = "idEnte") String idEnte);

	@Query(value = "SELECT count(*) FROM referente_delegati_partner "
			+ "where id_progetto = :idProgetto "
			+ "and id_ente = :idEnte "
			+ "and cf_utente = :codiceFiscale "
			+ "and codice_ruolo = :codiceRuolo ", 
			nativeQuery = true)
	public int isRefDegPartner(@Param(value = "codiceRuolo") String codiceFiscale, 
			@Param(value = "codiceRuolo") String codiceRuolo, 
			@Param(value = "idProgetto") String idProgetto, 
			@Param(value = "idEnte") String idEnte);

	@Query(value = "SELECT count(*) FROM ente_sede_progetto_facilitatore "
			+ "where id_progetto = :idProgetto "
			+ "and id_ente = :idEnte "
			+ "and id_facilitatore = :codiceFiscale "
			+ "and ruolo_utente = :codiceRuolo ", 
			nativeQuery = true)
	public int isFacVolProgettoAndEnte(@Param(value = "codiceRuolo") String codiceFiscale, 
			@Param(value = "codiceRuolo") String codiceRuolo, 
			@Param(value = "idProgetto") String idProgetto, 
			@Param(value = "idEnte") String idEnte); 
}