package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;

public interface ProgettoRepository extends JpaRepository<ProgettoEntity, Long> {
	
	@Query(value = ""
				 + " SELECT "
				 + "	 progetto.ID as id"
				 + "	,progetto.NOME_BREVE as nomeBreve"
				 + "	,progetto.STATO as stato"
				 + " FROM  "
				 + "	servizio ser "
				 + "	INNER JOIN progetto progetto"
				 + "	ON ser.ID_PROGETTO = progetto.ID "
				 + " WHERE 1=1 "
				 + "	AND ser.ID = :idServizio "
				 + "",
		   nativeQuery = true)
	List<ProgettoProjection> findProgettiByServizio(
			@Param(value = "idServizio") Long idServizio
		);
}