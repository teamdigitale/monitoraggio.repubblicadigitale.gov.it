package it.pa.repdgt.ente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;

@Repository
public interface ReferentiDelegatiEnteGestoreProgrammaRepository extends JpaRepository<ReferentiDelegatiEnteGestoreProgrammaEntity, ReferentiDelegatiEnteGestoreProgrammaKey> {

	@Query(value = " "
			+ " SELECT "
			 + "	 u.ID "
			 + "	,u.NOME "
			 + "	,u.COGNOME "
			 + "	,u.CODICE_FISCALE as codiceFiscale"
			 + "	,rdgp.STATO_UTENTE as STATO "
			 + " FROM "
			 + "	referente_delegati_gestore_programma rdgp"
			 + "    INNER JOIN utente u"
			 + "	ON u.CODICE_FISCALE = rdgp.CF_UTENTE"
			 + " WHERE 1=1 "
			 + "	AND ID_PROGRAMMA = :idProgramma "
			 + "	AND ID_ENTE = :idEnte "
			 + "	AND CODICE_RUOLO = 'REG'", 
	   nativeQuery = true)
	List<UtenteProjection> findNomeStatoReferentiEnteGestoreByIdProgrammaAndIdEnte(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idEnte") Long idEnte);

	@Query(value = " "
			+ " SELECT "
			 + "	 u.ID "
			 + "	,u.NOME "
			 + "	,u.COGNOME "
			 + "	,u.CODICE_FISCALE as codiceFiscale"
			 + "	,rdgp.STATO_UTENTE as STATO "
			 + " FROM "
			 + "	referente_delegati_gestore_programma rdgp"
			 + "    INNER JOIN utente u"
			 + "	ON u.CODICE_FISCALE = rdgp.CF_UTENTE"
			 + " WHERE 1=1 " 
			 + "	AND ID_PROGRAMMA = :idProgramma "
			 + "    AND ID_ENTE = :idEnte "
			 + "	AND CODICE_RUOLO = 'DEG'", 
	   nativeQuery = true)
	List<UtenteProjection> findNomeStatoDelegatiEnteGestoreByIdProgrammaAndIdEnte(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idEnte") Long idEnte);

	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_gestore_programma "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGRAMMA = :idProgramma "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE != :codiceFiscaleUtente "
			+ "	AND "
			+ "	ID_ENTE = :idEnte "
			+ " AND "
			+ " STATO_UTENTE = 'ATTIVO'",
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> findAltriReferentiODelegatiAttivi(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente, 
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "codiceRuolo") String codiceRuolo);

	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_gestore_programma "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGRAMMA != :idProgramma "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE = :codiceFiscaleUtente",
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> findAltreAssociazioni(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente, 
			@Param(value = "codiceRuolo") String codiceRuolo);

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_gestore_programma rdg "
			+ "WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "AND   rdg.ID_ENTE = :idEnte", 
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> findReferentiAndDelegatiByIdProgrammaAndIdEnte(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "idEnte") Long idEnte);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM referente_delegati_gestore_programma rdg "
			+ "WHERE rdg.CF_UTENTE = :codFiscaleUtente"
			+ "		AND rdg.CODICE_RUOLO = :codiceRuolo ", 
			nativeQuery = true)
	int countAssociazioniReferenteDelegato(
			@Param(value = "codFiscaleUtente") String codFiscaleUtente, 
			@Param(value = "codiceRuolo") String codiceRuolo);

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_gestore_programma rdg "
			+ "WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "		AND rdg.ID_ENTE = :idEnte "
			+ "		AND rdg.CF_UTENTE = :codiceFiscaleUtente"
			+ "		AND rdg.CODICE_RUOLO = :codiceRuolo", 
			nativeQuery = true)
	Optional<ReferentiDelegatiEnteGestoreProgrammaEntity> findReferenteDelegatiEnteGestoreProgramma(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente, 
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "codiceRuolo") String codiceRuolo);
}