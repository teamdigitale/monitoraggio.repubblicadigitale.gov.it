package it.pa.repdgt.integrazione.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgettoEntity;

@Repository
public interface ProgettoRepository extends JpaRepository<ProgettoEntity, Long>{
	
	@Query(value = " "
				 + " SELECT "
				 + "	p.* "
				 + " FROM   "
				 + "	progetto p "
				 + " WHERE 1=1     "
				 + "	AND p.STATO = :statoProgetto "
				 + " ",
		   nativeQuery = true)
	List<ProgettoEntity> findProgettiByStato(@Param(value = "statoProgetto") String statoProgetto);
} 