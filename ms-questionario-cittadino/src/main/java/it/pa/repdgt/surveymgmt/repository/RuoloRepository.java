package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.RuoloEntity;

public interface RuoloRepository extends JpaRepository<RuoloEntity, String> {

	@Query(value = " SELECT "
				 + "	ruolo.* "
				 + " FROM "
				 + "	RUOLO ruolo "
				 + "	INNER JOIN UTENTE_X_RUOLO uxr "
				 + "	ON uxr.RUOLO_CODICE = ruolo.CODICE "
				 + " 	INNER JOIN UTENTE utente "
				 + "	ON utente.CODICE_FISCALE = uxr.UTENTE_ID "
				 + " WHERE 1=1 "
				 + "   AND utente.CODICE_FISCALE = :codFiscale",
		  nativeQuery = true)
	List<RuoloEntity> findRuoliByCodiceFiscale(@Param(value = "codFiscale") String codiceFiscale);
}