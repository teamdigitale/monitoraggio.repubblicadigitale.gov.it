package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.VPrimoServizioCittadinoEntity;

@Repository
public interface VPrimoServizioCittadinoRepository extends JpaRepository<VPrimoServizioCittadinoEntity, Long> {

    @Query(value = "SELECT * FROM vw_primo_servizio_cittadino WHERE codice_fiscale = :codiceFiscale", nativeQuery = true)
    List<VPrimoServizioCittadinoEntity> findByCodiceFiscale(@Param("codiceFiscale") String codiceFiscale);

    @Query(value = "SELECT * FROM vw_primo_servizio_cittadino WHERE codice_fiscale IN (:codiciFiscali)", nativeQuery = true)
    List<VPrimoServizioCittadinoEntity> findByCodiceFiscaleIn(@Param("codiciFiscali") List<String> codiciFiscali);

    @Query(value = "SELECT * FROM vw_primo_servizio_cittadino WHERE id_cittadino = :idCittadino", nativeQuery = true)
    List<VPrimoServizioCittadinoEntity> findByIdCittadino(@Param("idCittadino") Long idCittadino);

}
