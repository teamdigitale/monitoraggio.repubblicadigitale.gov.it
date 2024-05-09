package it.pa.repdgt.surveymgmt.repository;

import it.pa.repdgt.shared.entity.RegistroAttivitaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroAttivitaRepository extends JpaRepository<RegistroAttivitaEntity, Long> {

    Page<RegistroAttivitaEntity> findAllByIdEnteAndIdProgetto(Pageable pageable, Long idEnte, Long idProgetto);

    Page<RegistroAttivitaEntity> findAllByOperatore(Pageable pageable, String operatore);

}
