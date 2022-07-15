package it.pa.repdgt.ente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@Repository
public interface ReferentiDelegatiEntePartnerDiProgettoRepository extends JpaRepository<ReferentiDelegatiEntePartnerDiProgettoEntity, ReferentiDelegatiEntePartnerDiProgettoKey> {
	
	@Query(value = " "
			+ " SELECT "
			 + "	 u.ID "
			 + "	,u.NOME "
			 + "	,u.COGNOME "
			 + "	,rdpp.STATO_UTENTE as STATO "
			 + " FROM "
			 + "	referente_delegati_partner rdpp"
			 + "    INNER JOIN utente u"
			 + "	ON u.CODICE_FISCALE = rdpp.CF_UTENTE"
			 + " WHERE 1=1 "
			 + "	AND ID_PROGETTO = :idProgetto "
			 + "	AND ID_ENTE = :idEnte "
			 + "	AND CODICE_RUOLO = 'REPP'", 
	   nativeQuery = true)
	List<UtenteProjection> findNomeStatoReferentiEntePartnerByIdProgettoAndIdEnte(Long idProgetto, Long idEnte);

	@Query(value = " "
			+ " SELECT "
			 + "	 u.ID "
			 + "	,u.NOME "
			 + "	,u.COGNOME "
			 + "	,rdpp.STATO_UTENTE as STATO "
			 + " FROM "
			 + "	referente_delegati_partner rdpp"
			 + "    INNER JOIN utente u"
			 + "	ON u.CODICE_FISCALE = rdpp.CF_UTENTE"
			 + " WHERE 1=1 " 
			 + "	AND ID_PROGETTO = :idProgetto "
			 + "	AND ID_ENTE = :idEnte "
			 + "	AND CODICE_RUOLO = 'DEPP'", 
	   nativeQuery = true)
	List<UtenteProjection> findNomeStatoDelegatiEntePartnerByIdProgettoAndIdEnte(Long idProgetto, Long idEnte);

	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_partner "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGETTO = :idProgetto "
			+ " AND "
			+ " ID_ENTE = :idEntePartner "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE != :codiceFiscaleUtente "
			+ "	AND "
			+ "	STATO_UTENTE = 'ATTIVO'",
			nativeQuery = true)
	List<ReferentiDelegatiEntePartnerDiProgettoEntity> findAltriReferentiODelegatiAttivi(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "idEntePartner") Long idEntePartner,
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente,
			@Param(value = "codiceRuolo") String codiceRuolo);

	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_partner "
			+ " WHERE 1=1 "
			+ " AND "
			+ " (ID_PROGETTO != :idProgetto OR ID_ENTE != :idEntePartner) "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE = :codiceFiscaleUtente",
			nativeQuery = true)
	List<ReferentiDelegatiEntePartnerDiProgettoEntity> findAltreAssociazioni(Long idProgetto, Long idEntePartner, String codiceFiscaleUtente, String codiceRuolo);

	@Modifying
	@Query(value = "DELETE FROM referente_delegati_partner rdp "
			+ "WHERE rdp.ID_ENTE = :idEnte "
			+ "		AND rdp.ID_PROGETTO = :idProgetto ", 
	nativeQuery = true)
	void cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(Long idEnte, Long idProgetto);

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_partner rdp "
			+ " WHERE rdp.ID_ENTE = :idEnte "
			+ "		AND rdp.ID_PROGETTO = :idProgetto ", 
			nativeQuery = true)
	List<ReferentiDelegatiEntePartnerDiProgettoEntity> findReferentiDelegatiEntePartner(Long idEnte, Long idProgetto);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM referente_delegati_partner rdp "
			+ "WHERE rdp.CF_UTENTE = :codFiscaleUtente "
			+ "		AND rdp.CODICE_RUOLO = :codiceRuolo ", 
			nativeQuery = true)
	int countAssociazioniReferenteDelegati(String codFiscaleUtente, String codiceRuolo);


	@Query(value = "SELECT * "
			+ "FROM referente_delegati_partner rdp "
			+ "WHERE rdp.ID_PROGETTO = :idProgetto "
			+ "		AND rdp.CF_UTENTE = :codiceFiscaleUtente "
			+ "		AND rdp.ID_ENTE = :idEnte"
			+ "		AND rdp.CODICE_RUOLO = :codiceRuolo", 
			nativeQuery = true)
	public Optional<ReferentiDelegatiEntePartnerDiProgettoEntity> findReferenteDelegatoEntePartner(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "codiceFiscaleUtente") String codiceFiscaleUtente, 
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "codiceRuolo") String codiceRuolo);

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_partner rdp "
			+ "WHERE rdp.ID_PROGETTO = :idProgetto "
			+ "AND   rdp.ID_ENTE = :idEnte", 
			nativeQuery = true)
	List<ReferentiDelegatiEntePartnerDiProgettoEntity> findReferentiAndDelegatiByIdProgettoAndIdEnte(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "idEnte") Long idEnte);
}