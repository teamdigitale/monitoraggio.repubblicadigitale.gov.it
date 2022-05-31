package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.RuoloEntity;

public interface RuoloRepository extends JpaRepository<RuoloEntity, String> {
	@Query(value = " "
			+ " SELECT "
			+ "		uxr.RUOLO_CODICE "
			+ " FROM "
			+ "		utente_x_ruolo uxr "
			+ " WHERE 1=1"
			+ "   AND uxr.UTENTE_ID = :codiceFiscale",
			nativeQuery = true)
	List<String> findRuoloByCodiceFiscaleUtente(@Param(value = "codiceFiscale") String codiceFiscale);
}