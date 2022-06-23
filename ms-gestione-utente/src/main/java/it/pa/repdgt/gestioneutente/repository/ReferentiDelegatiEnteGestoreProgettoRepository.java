package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.gestioneutente.entity.projection.ReferenteDelegatoEnteGestoreProgettoProjection;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;

@Repository
public interface ReferentiDelegatiEnteGestoreProgettoRepository extends JpaRepository<ReferentiDelegatiEnteGestoreProgettoEntity, ReferentiDelegatiEnteGestoreProgettoKey> {
	
	@Query(value = " "
			+ " SELECT         				       "
			+ "		u.email as email,              "
			+ "		rdgp.id_progetto as idProgetto "
			+ "  FROM                              "
			+ "		referente_delegati_gestore_progetto rdgp "
			+ "     INNER JOIN utente u                      "
			+ "		ON u.CODICE_FISCALE = rdgp.CF_UTENTE     "
			+ " WHERE 1=1 "
			+ "		AND rdgp.ID_PROGETTO IN ( :idsProgetto ) ", 
			nativeQuery = true)
	List<ReferenteDelegatoEnteGestoreProgettoProjection> findEmailReferentiDelegatiEnteGestoreByIdsProgetti(
			@Param(value = "idsProgetto") List<Long> idsProgetto
		);
}