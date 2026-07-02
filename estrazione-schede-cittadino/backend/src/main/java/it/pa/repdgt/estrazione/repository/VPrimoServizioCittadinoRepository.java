package it.pa.repdgt.estrazione.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.estrazione.entity.VPrimoServizioCittadinoEntity;

@Repository
public interface VPrimoServizioCittadinoRepository extends JpaRepository<VPrimoServizioCittadinoEntity, Long> {

	@Query(value = "SELECT * FROM vw_primo_servizio_cittadino WHERE codice_fiscale = :codiceFiscale", nativeQuery = true)
	List<VPrimoServizioCittadinoEntity> findByCodiceFiscale(@Param("codiceFiscale") String codiceFiscale);

	@Query(value = "SELECT * FROM vw_primo_servizio_cittadino WHERE id_cittadino = :idCittadino", nativeQuery = true)
	List<VPrimoServizioCittadinoEntity> findByIdCittadino(@Param("idCittadino") Long idCittadino);

}
