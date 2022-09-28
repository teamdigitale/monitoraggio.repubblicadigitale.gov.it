package it.pa.repdgt.surveymgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.TipologiaServizioEntity;

public interface TipologiaServizioRepository extends JpaRepository<TipologiaServizioEntity, Long> {
	@Modifying
	@Query(value = ""
			+ ""
			+ " DELETE "
			+ "	FROM   "
			+ "		tipologia_servizio ts               "
			+ " WHERE ts.SERVIZIO_ID = :idServizio"
			+ "",
		  nativeQuery = true)
	void deleteByIdServizio(@Param(value="idServizio") Long idServizio);
}