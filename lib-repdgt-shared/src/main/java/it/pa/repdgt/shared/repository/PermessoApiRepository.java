package it.pa.repdgt.shared.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.PermessoEntity;

public interface PermessoApiRepository extends JpaRepository<PermessoEntity, Long> {
	@Query(value = " "
				 + " SELECT "
				 + "	pa.codice_permesso "
				 + " FROM   "
				 + "	permessi_api pa    "
				 + " WHERE 1=1             "
				 + "	AND http_method = :metodoHttp           "
				 + "	AND :endpoint REGEXP pa.endpoint_regexp "
				 + " ",
		   nativeQuery = true)
	public List<String> findCodiciPermessiApiByMetodoHttpAndPath(
			@Param(value = "metodoHttp") String metodoHttp, 
			@Param(value = "endpoint")   String endpoint
		);
}