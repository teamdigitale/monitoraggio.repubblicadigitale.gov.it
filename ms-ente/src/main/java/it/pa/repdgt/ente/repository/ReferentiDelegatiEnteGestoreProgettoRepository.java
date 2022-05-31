package it.pa.repdgt.ente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;

@Repository
public interface ReferentiDelegatiEnteGestoreProgettoRepository extends JpaRepository<ReferentiDelegatiEnteGestoreProgettoEntity, ReferentiDelegatiEnteGestoreProgettoKey> {
	
	@Query(value = " "
			+ " SELECT "
			 + "	 u.ID "
			 + "	,u.NOME "
			 + "	,u.COGNOME "
			 + "	,u.STATO "
			 + " FROM "
			 + "	referente_delegati_gestore_progetto rdgp"
			 + "    INNER JOIN utente u"
			 + "	ON u.CODICE_FISCALE = rdgp.CF_UTENTE"
			 + " WHERE 1=1 "
			 + "	AND ID_PROGETTO = :idProgetto "
			 + "	AND CODICE_RUOLO = 'REGP'", 
	   nativeQuery = true)
	List<UtenteProjection> findNomeStatoReferentiEnteGestoreByProgetto(Long idProgetto);

	@Query(value = " "
			+ " SELECT "
			 + "	 u.ID "
			 + "	,u.NOME "
			 + "	,u.COGNOME "
			 + "	,u.STATO "
			 + " FROM "
			 + "	referente_delegati_gestore_progetto rdgp"
			 + "    INNER JOIN utente u"
			 + "	ON u.CODICE_FISCALE = rdgp.CF_UTENTE"
			 + " WHERE 1=1 " 
			 + "	AND ID_PROGETTO = :idProgetto "
			 + "	AND CODICE_RUOLO = 'DEGP'", 
	   nativeQuery = true)
	List<UtenteProjection> findNomeStatoDelegatiEnteGestoreByProgetto(Long idProgetto);

	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_gestore_progetto "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGETTO = :idProgetto "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE != :codiceFiscaleUtente "
			+ "	AND "
			+ "	ID_ENTE = :idEnte "
			+ "	AND "
			+ "	STATO_UTENTE = 'ATTIVO'",
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgettoEntity> findAltriReferentiODelegatiAttivi(
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente, 
			@Param(value = "idEnte") Long idEnte, 
			@Param(value = "codiceRuolo") String codiceRuolo);

	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_gestore_progetto "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGETTO != :idProgetto "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE = :codiceFiscaleUtente",
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgettoEntity> findAltreAssociazioni(Long idProgetto,
			String codiceFiscaleUtente, String codiceRuolo);

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_gestore_progetto rdgp "
			+ "WHERE rdgp.ID_PROGETTO = :idProgetto ", 
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgettoEntity> findReferentieDelegatiPerProgetto(Long idProgetto);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM referente_delegati_gestore_progetto rdgp "
			+ "WHERE rdgp.CF_UTENTE = :codFiscaleUtente "
			+ "		AND rdgp.CODICE_RUOLO = :codiceRuolo ", 
			nativeQuery = true)
	int countAssociazioniReferenteDelegato(String codFiscaleUtente, String codiceRuolo);

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_gestore_progetto rdgp "
			+ "WHERE rdgp.ID_PROGETTO = :idProgetto "
			+ "		AND rdgp.CF_UTENTE = :codiceFiscaleUtente "
			+ "		AND rdgp.ID_ENTE = :idEnte", 
			nativeQuery = true)
	ReferentiDelegatiEnteGestoreProgettoEntity findReferenteDelegatiEnteGestoreProgetto(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente,
			@Param(value = "idEnte") Long idEnte);
}