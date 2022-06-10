package it.pa.repdgt.surveymgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.ServizioEntity;

public interface ServizioSqlRepository extends JpaRepository<ServizioEntity, Long> {

	@Query(value = ""
				 + " SELECT "
				 + "	*"
				 + " FROM "
				 + "	servizio s"
				 + " WHERE 1=1"
				 + " 	AND s.NOME = :nomeServizio",
		   nativeQuery = true)
	Optional<ServizioEntity> findServizioByNome(
		@Param(value = "nomeServizio") String nomeServizio
		); 
	}