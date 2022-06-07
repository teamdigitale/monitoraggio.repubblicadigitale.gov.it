package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.EntePartnerEntity;

@Repository
public interface EntePartnerRepository extends JpaRepository<EntePartnerEntity, Long> {

	@Query(value = "SELECT rdp.ID_PROGETTO "
			+ "FROM referente_delegati_partner rdp "
			+ "WHERE rdp.CF_UTENTE = :cfUtente "
			+ "		AND rdp.CODICE_RUOLO = :ruolo ", 
			nativeQuery = true)
	public List<Long> findIdProgettiEntePartnerByRuoloUtente(
			@Param(value = "cfUtente") String cfUtente,
			@Param(value = "ruolo") String ruolo
	);

}