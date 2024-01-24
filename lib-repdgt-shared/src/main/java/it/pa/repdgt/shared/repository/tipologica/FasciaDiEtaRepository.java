package it.pa.repdgt.shared.repository.tipologica;

import it.pa.repdgt.shared.entity.tipologica.FasciaDiEtaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FasciaDiEtaRepository extends JpaRepository<FasciaDiEtaEntity, Long> {
    FasciaDiEtaEntity findByFascia(String fasciaDiEta);
}