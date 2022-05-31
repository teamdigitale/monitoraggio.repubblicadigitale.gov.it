package it.pa.repdgt.gestioneutente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.GruppoEntity;

public interface GruppoRepository extends JpaRepository<GruppoEntity, String> {

	@Query(value = " SELECT "
				 + "	 g "
				 + " FROM "
				 + "	GruppoEntity g "
				 + " WHERE g.codice = :codiceGruppo")
	Optional<GruppoEntity> findByCodice(@Param(value = "codiceGruppo") String codiceGruppo);
	
	@Query(value =  "SELECT "
				  + "	g.* "
				  + " FROM  "
				  + "	gruppo g"
				  + "   INNER JOIN ruolo_x_gruppo gxr   "
				  + "	ON g.CODICE = gxr.GRUPPO_CODICE "
				  + " WHERE 1=1 "
				  + "	AND gxr.RUOLO_CODICE = :codiceRuolo"
				  , nativeQuery = true)
	List<GruppoEntity> findGruppiByRuolo(@Param(value = "codiceRuolo") String codiceRuolo); 
}
