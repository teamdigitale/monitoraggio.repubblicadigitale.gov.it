package it.pa.repdgt.surveymgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ServizioXCittadinoEntity;

@Repository
public interface ServizioXCittadinoRepository extends JpaRepository<ServizioXCittadinoEntity, String> {

	@Query(value = " "
				 + " SELECT "
				 + "	COUNT(*)"
				 + " FROM "
				 + "	servizio_x_cittadino sxc "
				 + " WHERE 1=1 "
				 + "	AND sxc.ID_SERVIZIO  = :idServizio  "
				 + " 	AND sxc.ID_CITTADINO = :idCittadino "
				 + " ",
		   nativeQuery = true)
	int findCittadinoByIdServizioAndIdCittadino(
		@Param(value = "idServizio")  Long idServizio,
		@Param(value = "idCittadino") Long idCittadino
	);
}