package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteSedeProjection;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Repository
public interface ContestoRepository extends JpaRepository<ProgrammaEntity, Long> {

	@Query(value = "SELECT p.* "
			+ "FROM referente_delegati_gestore_programma rdgp "
			+ "INNER JOIN programma p "
			+ "on rdgp.id_programma = p.id "
			+ "AND rdgp.id_ente  = p.id_ente_gestore_programma "
			+ "WHERE rdgp.cf_utente = :codiceFiscale "
			+ "AND rdgp.codice_ruolo = 'REG'", nativeQuery = true)
	List<ProgrammaEntity> findProgrammiREG(@Param(value = "codiceFiscale")String codiceFiscale);
	
	@Query(value = "SELECT p.* "
			+ "FROM referente_delegati_gestore_programma rdgp "
			+ "INNER JOIN programma p "
			+ "on rdgp.id_programma = p.id "
			+ "AND rdgp.id_ente  = p.id_ente_gestore_programma "
			+ "WHERE rdgp.cf_utente = :codiceFiscale "
			+ "AND rdgp.codice_ruolo = 'DEG'", nativeQuery = true)
	List<ProgrammaEntity> findProgrammiDEG(@Param(value = "codiceFiscale")String codiceFiscale);
	
	@Query(value = "SELECT DISTINCT p.* "
			+ "FROM referente_delegati_gestore_progetto rdgp "
			+ "INNER JOIN progetto pr "
			+ "on rdgp.id_progetto = pr.id "
			+ "AND rdgp.id_ente  = pr.id_ente_gestore_progetto "
			+ "INNER JOIN programma p "
			+ "on pr.id_programma = p.id "
			+ "WHERE rdgp.cf_utente = :codiceFiscale "
			+ "AND rdgp.codice_ruolo = 'REGP'", nativeQuery = true)
	List<ProgrammaEntity> findProgrammiREGP(@Param(value = "codiceFiscale")String codiceFiscale);
	
	@Query(value = "SELECT DISTINCT p.* "
			+ "FROM referente_delegati_gestore_progetto rdgp "
			+ "INNER JOIN progetto pr "
			+ "on rdgp.id_progetto = pr.id "
			+ "AND rdgp.id_ente  = pr.id_ente_gestore_progetto "
			+ "INNER JOIN programma p "
			+ "on pr.id_programma = p.id "
			+ "WHERE rdgp.cf_utente = :codiceFiscale "
			+ "AND rdgp.codice_ruolo = 'DEGP'", nativeQuery = true)
	List<ProgrammaEntity> findProgrammiDEGP(@Param(value = "codiceFiscale")String codiceFiscale);
	
	@Query(value = "SELECT DISTINCT p.* "
			+ "     FROM referente_delegati_partner rdp "
			+ "     INNER JOIN ente_partner ep "
			+ "           on rdp.id_progetto = ep.id_progetto "
			+ "           and rdp.id_ente = ep.id_ente"
			+ "     INNER JOIN progetto pr "
			+ "           on ep.id_progetto = pr.id "
			+ "     INNER JOIN programma p "
			+ "           on pr.id_programma = p.id "
			+ "     WHERE rdp.cf_utente = :codiceFiscale "
			+ "		AND rdp.codice_ruolo = 'REPP'"
			+ "		AND (rdp.STATO_UTENTE <> 'TERMINATO' "
			+ "			 OR "
			+ "			 ep.terminato_singolarmente = false)", nativeQuery = true)
	List<ProgrammaEntity> findProgrammiREPP(@Param(value = "codiceFiscale")String codiceFiscale);
	
	@Query(value = "SELECT DISTINCT p.* "
			+ "     FROM referente_delegati_partner rdp "
			+ "     INNER JOIN ente_partner ep "
			+ "           on rdp.id_progetto = ep.id_progetto "
			+ "           and rdp.id_ente = ep.id_ente"
			+ "     INNER JOIN progetto pr "
			+ "           on ep.id_progetto = pr.id "
			+ "     INNER JOIN programma p "
			+ "           on pr.id_programma = p.id "
			+ "     WHERE rdp.cf_utente = :codiceFiscale "
			+ "		AND rdp.codice_ruolo = 'DEPP' "
			+ "		AND (rdp.STATO_UTENTE <> 'TERMINATO' "
			+ "			 OR "
			+ "			 ep.terminato_singolarmente = false)", nativeQuery = true)
	List<ProgrammaEntity> findProgrammiDEPP(@Param(value = "codiceFiscale")String codiceFiscale);
	
	@Query(value = "SELECT DISTINCT p.* "
			+ "FROM progetto pr "
			+ "INNER JOIN programma p "
			+ "on pr.id_programma = p.id "
			+ "WHERE pr.ID in (:listaProgettiPerFacilitatore)", nativeQuery = true)
	List<ProgrammaEntity> findProgrammiFacVol(@Param(value = "listaProgettiPerFacilitatore")List<Long> listaProgettiPerFacilitatore);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE programma "
			+ "SET STATO = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP, "
			+ "data_ora_attivazione_programma = CURRENT_TIMESTAMP "
			+ "WHERE ID = :idProgramma", nativeQuery = true)
	void updateStatoProgrammaToAttivo(@Param(value = "idProgramma")Long idProgramma);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE programma "
			+ "SET STATO_GESTORE_PROGRAMMA = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID = :idProgramma", nativeQuery = true)
	void updateStatoGestoreProgrammaToAttivo(@Param(value = "idProgramma")Long idProgramma);
	
	@Query(value = "SELECT distinct p.id "
			+ "FROM progetto p "
			+ "INNER JOIN ente_sede_progetto_facilitatore espf "
			+ "ON p.ID = espf.ID_PROGETTO "
			+ "WHERE p.id_programma = :idProgramma "
			+ "AND p.STATO = 'NON ATTIVO'", nativeQuery = true)
	List<Long> getIdsProgettiAttivabili(@Param(value = "idProgramma")Long idProgramma);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE progetto "
			+ "SET STATO = 'ATTIVABILE' ,"
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID in (:idsProgetti)", nativeQuery = true)
	void rendiProgettiAttivabili(@Param(value = "idsProgetti")List<Long> idsProgetti);	
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE progetto "
			+ "SET STATO_GESTORE_PROGETTO = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID in (:idsProgetti)", nativeQuery = true)
	void updateStatoGestoreProgettoInAttivo(@Param(value = "idsProgetti")List<Long> idsProgetti);
	
	@Query(value = "SELECT distinct p.id "
			+ "FROM progetto p "
			+ "INNER JOIN referente_delegati_gestore_progetto rdgp "
			+ "ON p.ID = rdgp.ID_PROGETTO "
			+ "WHERE p.id_programma = :idProgramma "
			+ "AND STATO_GESTORE_PROGETTO = 'NON ATTIVO'"
			+ "AND CF_UTENTE = :codiceFiscale "
			+ "AND CODICE_RUOLO = :ruolo", nativeQuery = true)
	List<Long> getIdsProgettiPerAttivareGestoreProgettoInAttivo(@Param(value = "idProgramma")Long idProgramma, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "ruolo")String ruolo);
	
	@Query(value = "SELECT distinct ep.ID_PROGETTO as idProgetto, ep.ID_ENTE as idEnte, ep.STATO_ENTE_PARTNER as stato "
			+ "		FROM progetto p "
			+ "		INNER JOIN ente_partner ep "
			+ "		on p.ID = ep.ID_PROGETTO "
			+ "		INNER JOIN referente_delegati_partner  rdp "
			+ "		ON ep.ID_PROGETTO = rdp.ID_PROGETTO "
			+ "		AND ep.ID_ENTE = rdp.ID_ENTE"
			+ "		WHERE p.id_programma = :idProgramma "
			+ "		AND rdp.CF_UTENTE = :codiceFiscale "
			+ "		AND rdp.CODICE_RUOLO = :ruolo", nativeQuery = true)
	List<ProgettoEnteProjection> findEntiPartnerNonAttiviPerProgrammaECodiceFiscaleReferenteDelegato(@Param(value = "idProgramma")Long idProgramma, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "ruolo")String ruolo);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE ente_partner "
			+ "SET STATO_ENTE_PARTNER = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGETTO = :idProgetto "
			+ "AND ID_ENTE = :idEnte", nativeQuery = true)
	void updateStatoEntePartnerProgettoToAttivo(@Param(value = "idProgetto")Long idProgetto, 
			@Param(value = "idEnte")Long idEnte);
	
	@Query(value = "select esp.id_ente as idEnte, esp.id_sede as idSede, esp.id_progetto as idProgetto, esp.stato_sede as stato "
			+ "from ente_sede_progetto_facilitatore espf "
			+ "INNER JOIN ente_sede_progetto esp "
			+ "ON espf.id_progetto = esp.ID_PROGETTO "
			+ "AND espf.id_ente = esp.ID_ente "
			+ "AND espf.id_sede = esp.id_sede "
			+ "where espf.id_progetto in (select id from PROGETTO where id_programma = :idProgramma) "
			+ "and espf.ID_FACILITATORE = :codiceFiscale "
			+ "and espf.RUOLO_UTENTE = :ruolo ", nativeQuery = true)
	List<ProgettoEnteSedeProjection> findSediPerProgrammaECodiceFiscaleFacilitatoreVolontario(@Param(value = "idProgramma")Long idProgramma, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "ruolo")String ruolo);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE ente_sede_progetto "
			+ "SET STATO_SEDE = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGETTO = :idProgetto "
			+ "AND ID_ENTE = :idEnte "
			+ "AND ID_SEDE = :idSede", nativeQuery = true)
	void updateStatoSedeProgettoToAttivo(@Param(value = "idProgetto")Long idProgetto, 
			@Param(value = "idEnte")Long idEnte, 
			@Param(value = "idSede")Long idSede);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE referente_delegati_gestore_programma "
			+ "SET STATO_UTENTE = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGRAMMA = :idProgramma "
			+ "AND CF_UTENTE = :codiceFiscale "
			+ "AND CODICE_RUOLO = :codiceRuolo", nativeQuery = true)
	void attivaREGDEG(@Param(value = "idProgramma")Long idProgramma, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE referente_delegati_gestore_progetto "
			+ "SET STATO_UTENTE = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGETTO in ( SELECT ID FROM progetto WHERE ID_PROGRAMMA = :idProgramma)  "
			+ "AND CF_UTENTE = :codiceFiscale "
			+ "AND CODICE_RUOLO = :codiceRuolo", nativeQuery = true)
	void attivaREGPDEGP(@Param(value = "idProgramma")Long idProgramma, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE referente_delegati_partner "
			+ "SET STATO_UTENTE = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGETTO = :idProgetto "
			+ "AND ID_ENTE = :idEnte "
			+ "AND CF_UTENTE = :codiceFiscale "
			+ "AND CODICE_RUOLO = :codiceRuolo", nativeQuery = true)
	void attivaREPPDEPP(@Param(value = "idProgetto")Long idProgetto, 
			@Param(value = "idEnte")Long idEnte, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE ente_sede_progetto_facilitatore "
			+ "SET STATO_UTENTE = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGETTO = :idProgetto "
			+ "AND ID_ENTE = :idEnte "
			+ "AND ID_SEDE = :idSede "
			+ "AND ID_FACILITATORE = :codiceFiscale "
			+ "AND ruolo_utente = :codiceRuolo", nativeQuery = true)
	void attivaFACVOL(@Param(value = "idProgetto")Long idProgetto, 
			@Param(value = "idEnte")Long idEnte, 
			@Param(value = "idSede")Long idSede, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "codiceRuolo")String codiceRuolo);
}