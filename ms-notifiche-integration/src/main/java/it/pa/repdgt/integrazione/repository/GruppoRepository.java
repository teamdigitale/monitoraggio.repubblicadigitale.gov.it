package it.pa.repdgt.integrazione.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.GruppoEntity;

@Repository
public interface GruppoRepository extends JpaRepository<GruppoEntity, Long> {
	
	@Query(value = " "
				 + " SELECT "
				 + " 	rxg.gruppo_codice as gruppoCodice"
				 + " FROM "
				 + " 	ruolo r "
				 + " INNER JOIN ruolo_x_gruppo rxg ON r.codice = rxg.ruolo_codice "
				 + " WHERE 1=1"
				 + "	AND r.codice = :codiceRuolo "
				 + " ", 
		   nativeQuery = true)
	public List<String> findCodiciGruppoByCodiceRuolo(@Param(value = "codiceRuolo") final String codiceRuolo);
}