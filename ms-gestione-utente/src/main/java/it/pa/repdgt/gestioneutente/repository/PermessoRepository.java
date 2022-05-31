package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.PermessoEntity;

@Repository
public interface PermessoRepository extends JpaRepository<PermessoEntity, Long> {
	
	@Query(value = "SELECT * "
			+ "FROM permesso p "
			+ "INNER JOIN gruppo_x_permesso  gp "
			+ "ON p.ID = gp.PERMESSO_ID "
			+ "WHERE gp.GRUPPO_CODICE = :codiceGruppo", nativeQuery = true)		
	List<PermessoEntity> findPermessiByGruppo(@Param(value = "codiceGruppo") String codiceRuolo);
}