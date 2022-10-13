package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import it.pa.repdgt.gestioneutente.entity.projection.ProfiloProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteSedeProjection;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Repository
public interface ContestoRepository extends JpaRepository<ProgrammaEntity, Long> {
	
	@Query(value = "SELECT COUNT(*) "
			+ "FROM progetto p "
			+ "WHERE p.id = :idProgetto "
			+ "AND p.id_programma = :idProgramma ", nativeQuery = true)
	Integer getProgettoProgramma(@Param(value = "idProgetto")Long idProgetto,
			@Param(value = "idProgramma")Long idProgramma);

	@Query(value = "SELECT p.id as idProgramma, "
			+ "p.nome_breve as nomeProgramma, "
			+ "e.nome_breve as nomeEnte "
			+ "e.id as idEnte "
			+ "FROM referente_delegati_gestore_programma rdgp "
			+ "INNER JOIN programma p "
			+ "on rdgp.id_programma = p.id "
			+ "AND rdgp.id_ente  = p.id_ente_gestore_programma "
			+ "INNER JOIN ente e "
			+ "on e.id = p.id_ente_gestore_programma "
			+ "WHERE rdgp.cf_utente = :codiceFiscale "
			+ "AND rdgp.codice_ruolo = :codiceRuolo", nativeQuery = true)
	List<ProfiloProjection> findProgrammiREGDEG(@Param(value = "codiceFiscale")String codiceFiscale,
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Query(value = "SELECT DISTINCT p.id as idProgramma, "
			+ "p.nome_breve as nomeProgramma, "
			+ "pr.id as idProgetto, "
			+ "e.nome_breve as nomeEnte, "
			+ "e.id as idEnte, "
			+ "pr.NOME_BREVE as nomeBreveProgetto "
			+ "FROM referente_delegati_gestore_progetto rdgp "
			+ "INNER JOIN progetto pr "
			+ "on rdgp.id_progetto = pr.id "
			+ "AND rdgp.id_ente  = pr.id_ente_gestore_progetto "
			+ "INNER JOIN ente e "
			+ "on e.id = pr.id_ente_gestore_progetto "
			+ "INNER JOIN programma p "
			+ "on pr.id_programma = p.id "
			+ "WHERE rdgp.cf_utente = :codiceFiscale "
			+ "AND rdgp.codice_ruolo = :codiceRuolo", nativeQuery = true)
	List<ProfiloProjection> findProgrammiProgettiREGPDEGP(@Param(value = "codiceFiscale")String codiceFiscale,
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Query(value = "SELECT DISTINCT p.id as idProgramma, "
			+ "p.nome_breve as nomeProgramma, "
			+ "pr.id as idProgetto, "
			+ "e.nome_breve as nomeEnte, "
			+ "e.id as idEnte, "
			+ "pr.NOME_BREVE as nomeBreveProgetto "
			+ "     FROM referente_delegati_partner rdp "
			+ "     INNER JOIN ente_partner ep "
			+ "           on rdp.id_progetto = ep.id_progetto "
			+ "           and rdp.id_ente = ep.id_ente"
			+ "     INNER JOIN ente e "
			+ "			  on e.id = ep.id_ente "
			+ "     INNER JOIN progetto pr "
			+ "           on ep.id_progetto = pr.id "
			+ "     INNER JOIN programma p "
			+ "           on pr.id_programma = p.id "
			+ "     WHERE rdp.cf_utente = :codiceFiscale "
			+ "		AND rdp.codice_ruolo = :codiceRuolo"
			+ "		AND (rdp.STATO_UTENTE <> 'TERMINATO' "
			+ "			 OR "
			+ "			 ep.terminato_singolarmente = false)", nativeQuery = true)
	List<ProfiloProjection> findProgrammiProgettiREPPDEPP(@Param(value = "codiceFiscale")String codiceFiscale,
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Query(value = "SELECT DISTINCT p.id as idProgramma, "
			+ "			p.nome_breve as nomeProgramma, "
			+ "			pr.id as idProgetto, "
			+ "			e.nome_breve as nomeEnte, "
			+ "			e.id as idEnte, "
			+ "			pr.NOME_BREVE as nomeBreveProgetto "
			+ "FROM progetto pr "
			+ "INNER JOIN (SELECT DISTINCT espf.ID_PROGETTO, espf.id_ente "
			+ "			FROM ente_sede_progetto_facilitatore espf "
			+ "			WHERE espf.ID_FACILITATORE = :codiceFiscale"
			+ "			AND RUOLO_UTENTE = :ruolo"
			+ "			AND STATO_UTENTE <> 'TERMINATO') espfl "
			+ "ON pr.id = espfl.id_progetto "
			+ "INNER JOIN ente e "
			+ "on e.id = espfl.id_ente "
			+ "INNER JOIN programma p "
			+ "on pr.id_programma = p.id ", nativeQuery = true)
	List<ProfiloProjection> findProgrammiProgettiFacVol(@Param(value = "codiceFiscale")String codiceFiscale,
			@Param(value = "ruolo")String ruolo);
	
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
			+ "DATA_ORA_PROGETTO_ATTIVABILE = CURRENT_TIMESTAMP "
			+ "WHERE ID in (:idsProgetti)", nativeQuery = true)
	void rendiProgettiAttivabili(@Param(value = "idsProgetti")List<Long> idsProgetti);	
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE progetto "
			+ "SET STATO_GESTORE_PROGETTO = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID = :idProgetto", nativeQuery = true)
	void updateStatoGestoreProgettoInAttivo(@Param(value = "idProgetto")Long idProgetto);
	
	@Query(value = "SELECT p.id as idProgetto, p.STATO_GESTORE_PROGETTO as stato "
			+ "FROM progetto p "
			+ "WHERE p.id = :idProgetto "
			+ "AND p.id_programma = :idProgramma ", nativeQuery = true)
	ProgettoEnteProjection getProgettoEnteGestoreProgetto(@Param(value = "idProgetto")Long idProgetto,
			@Param(value = "idProgramma")Long idProgramma);
	
	@Query(value = "SELECT distinct ep.ID_PROGETTO as idProgetto, ep.ID_ENTE as idEnte, ep.STATO_ENTE_PARTNER as stato "
			+ "		FROM progetto p "
			+ "		INNER JOIN ente_partner ep "
			+ "		on p.ID = ep.ID_PROGETTO "
			+ "		INNER JOIN referente_delegati_partner  rdp "
			+ "		ON ep.ID_PROGETTO = rdp.ID_PROGETTO "
			+ "		AND ep.ID_ENTE = rdp.ID_ENTE"
			+ "		WHERE p.id = :idProgetto "
			+ "     AND p.id_programma = :idProgramma"
			+ "		AND ep.id_ente = :idEnte"
			+ "		AND rdp.CF_UTENTE = :codiceFiscale "
			+ "		AND rdp.CODICE_RUOLO = :ruolo "
			+ "     AND ep.stato_ente_partner <> 'TERMINATO'", nativeQuery = true)
	ProgettoEnteProjection findEntePartnerNonTerminatoPerProgettoAnIdEnteAndCodiceFiscaleReferenteDelegato(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idProgetto")  Long idProgetto,
			@Param(value = "idEnte")      Long idEnte,
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
			+ "where espf.id_progetto = :idProgetto "
			+ "and espf.ID_FACILITATORE = :codiceFiscale "
			+ "and espf.RUOLO_UTENTE = :ruolo "
			+ "and esp.ID_ente = :idEnte", nativeQuery = true)
	List<ProgettoEnteSedeProjection> findSedePerProgrammaAndIdEnteAndCodiceFiscaleFacilitatoreVolontario(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "idEnte")     Long idEnte,
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "ruolo")String ruolo);
	
	@Query(value = "SELECT COUNT(*) "
			+ "FROM referente_delegati_gestore_programma "
			+ "where cf_utente = :codiceFiscale "
			+ "and codice_ruolo = :ruolo "
			+ "and id_programma = :idProgramma", nativeQuery = true)
	Integer verificaUtenteRuoloDEGREGPerProgramma(@Param(value = "idProgramma")Long idProgramma, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "ruolo")String ruolo);
	
	@Query(value = "SELECT COUNT(*) "
			+ "FROM referente_delegati_gestore_progetto "
			+ "where cf_utente = :codiceFiscale "
			+ "and codice_ruolo = :ruolo "
			+ "and id_progetto = :idProgetto", nativeQuery = true)
	Integer verificaUtenteRuoloDEGPREGPPerProgetto(@Param(value = "idProgetto")Long idProgetto, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "ruolo")String ruolo);
	
	@Query(value = "SELECT COUNT(*) "
			+ "FROM referente_delegati_partner "
			+ "where cf_utente = :codiceFiscale "
			+ "and codice_ruolo = :ruolo "
			+ "and id_progetto = :idProgetto", nativeQuery = true)
	Integer verificaUtenteRuoloDEPPREPPPerProgetto(@Param(value = "idProgetto")Long idProgetto, 
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
			+ "AND CODICE_RUOLO = :codiceRuolo "
			+ "AND STATO_UTENTE <> 'TERMINATO'", nativeQuery = true)
	void attivaREGDEG(@Param(value = "idProgramma")Long idProgramma, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE referente_delegati_gestore_progetto "
			+ "SET STATO_UTENTE = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGETTO = :idProgetto "
			+ "AND CF_UTENTE = :codiceFiscale "
			+ "AND CODICE_RUOLO = :codiceRuolo "
			+ "AND STATO_UTENTE <> 'TERMINATO'", nativeQuery = true)
	void attivaREGPDEGP(@Param(value = "idProgetto")Long idProgetto, 
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
			+ "AND CODICE_RUOLO = :codiceRuolo "
			+ "AND STATO_UTENTE <> 'TERMINATO'", nativeQuery = true)
	void attivaREPPDEPP(@Param(value = "idProgetto")Long idProgetto, 
			@Param(value = "idEnte")Long idEnte, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE ente_sede_progetto_facilitatore "
			+ "SET STATO_UTENTE = 'ATTIVO', "
			+ "DATA_ORA_AGGIORNAMENTO = CURRENT_TIMESTAMP, "
			+ "DATA_ORA_ATTIVAZIONE = CURRENT_TIMESTAMP "
			+ "WHERE ID_PROGETTO = :idProgetto "
			+ "AND ID_ENTE = :idEnte "
			+ "AND ID_SEDE = :idSede "
			+ "AND ID_FACILITATORE = :codiceFiscale "
			+ "AND ruolo_utente = :codiceRuolo "
			+ "AND STATO_UTENTE <> 'TERMINATO'", nativeQuery = true)
	void attivaFACVOL(@Param(value = "idProgetto")Long idProgetto, 
			@Param(value = "idEnte")Long idEnte, 
			@Param(value = "idSede")Long idSede, 
			@Param(value = "codiceFiscale")String codiceFiscale, 
			@Param(value = "codiceRuolo")String codiceRuolo);
}