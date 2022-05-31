package it.pa.repdgt.gestioneutente.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.RuoloXGruppo;
import it.pa.repdgt.shared.entity.key.RuoloXGruppoKey;

@Repository
public interface RuoloXGruppoRepository extends JpaRepository<RuoloXGruppo, RuoloXGruppoKey> {

	@Query(value = " DELETE "
				 + " FROM "
				 + "	  RUOLO_X_GRUPPO rxg "
				 + " WHERE 1=1 "
				 + "	AND rxg.RUOLO_CODICE = :codiceRuolo",
				 nativeQuery = true)
	@Modifying
	void deleteAllRuoloXGruppoByCodiceRuolo(@Param(value = "codiceRuolo") String codiceRuolo); 
}