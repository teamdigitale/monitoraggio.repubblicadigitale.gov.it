package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.EntePartnerEntity;

@Repository
public interface EntePartnerRepository extends JpaRepository<EntePartnerEntity, Long> {

	@Query(value = "SELECT ID_ENTE "
			+ "FROM ente_partner ep "
			+ "INNER JOIN progetto p "
			+ "ON ep.ID_PROGETTO = p.ID "
			+ "WHERE "
			+ "   p.ID = :idProgetto", nativeQuery = true)
	public List<Long> findIdEntiPartnerByProgetto(
			@Param(value = "idProgetto") Long idProgetto);

	@Query(value = "SELECT utente.NOME, utente.COGNOME "
			+ "FROM UTENTE utente "
			+ "	INNER JOIN referente_delegati_partner  rdp "
			+ "		ON utente.CODICE_FISCALE = rdp.CF_UTENTE "
			+ "WHERE rdp.ID_PROGETTO = :idProgetto "
			+ "		AND rdp.CODICE_RUOLO = 'REPP' "
			+ "		AND rdp.ID_ENTE = :idEnte ", 
			nativeQuery = true)
	public List<String> findReferentiEntePartnerProgetto(
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "idEnte") Long idEnte
	);

	@Query(value = "SELECT ep.STATO_ENTE_PARTNER "
			+ "FROM ente_partner ep "
			+ "WHERE ep.ID_PROGETTO = :idProgetto "
			+ "		AND ep.ID_ENTE = :idEnte ", 
			nativeQuery = true)
	public String findStatoEntePartner(
			@Param(value = "idProgetto") Long idProgetto, 
			@Param(value = "idEnte") Long idEnte
	);

	@Modifying
	@Query(value = "DELETE "
			+ "FROM ente_partner ep "
			+ "WHERE ep.ID_PROGETTO = :idProgetto ",
			nativeQuery = true)
	void cancellaEntiPartner(Long idProgetto);

	@Query(value = "SELECT * "
			+ "FROM ente_partner "
			+ "WHERE "
			+ "  ID_PROGETTO = :idProgetto", nativeQuery = true)
	public List<EntePartnerEntity> findEntiPartnerByProgetto(
			@Param(value = "idProgetto") Long idProgetto);

}
