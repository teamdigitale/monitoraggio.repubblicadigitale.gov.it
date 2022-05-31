package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@Repository
public interface ReferentiDelegatiEntePartnerRepository extends JpaRepository<ReferentiDelegatiEntePartnerDiProgettoEntity, ReferentiDelegatiEntePartnerDiProgettoKey> {

	@Query(value = ""
			 + " SELECT * "
			 + " FROM "
			 + "	referente_delegati_partner "
			 + " WHERE 1=1"
			 + "	AND ID_PROGETTO = :idProgetto",
	   nativeQuery = true)
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> getReferentiDelegatiEnteGestoreProgettoByIdProgetto(@Param(value = "idProgetto") Long idProgetto);
	
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

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_partner rdp "
			+ "WHERE rdp.ID_ENTE = :idEnte "
			+ "		AND rdp.ID_PROGETTO = :idProgetto ", 
			nativeQuery = true)
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> findReferentiEDelegatiEntePartner(
			@Param(value = "idEnte") Long idEnte,
			@Param(value = "idProgetto") Long idProgetto);
}