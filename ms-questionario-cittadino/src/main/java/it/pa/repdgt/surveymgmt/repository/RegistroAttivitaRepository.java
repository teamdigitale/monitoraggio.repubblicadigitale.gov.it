package it.pa.repdgt.surveymgmt.repository;

import it.pa.repdgt.shared.entity.RegistroAttivitaEntity;
import it.pa.repdgt.shared.entityenum.JobStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistroAttivitaRepository extends JpaRepository<RegistroAttivitaEntity, Long> {

    Page<RegistroAttivitaEntity> findAllByCodiceFiscale(Pageable pageable, String cfUtenteLoggato);

    Page<RegistroAttivitaEntity> findAllByIdEnteAndIdProgettoAndJobStatus(Pageable pageable, Long idEnte,
            Long idProgetto, JobStatusEnum jobStatusEnum);

    Page<RegistroAttivitaEntity> findAllByCodiceFiscaleAndJobStatus(Pageable pageable, String cfUtenteLoggato,
            JobStatusEnum jobStatusEnum);

    Optional<RegistroAttivitaEntity> findByJobUUIDAndJobStatus(String jobUUID, JobStatusEnum success);

    Optional<RegistroAttivitaEntity> findByJobUUID(String jobUUID);
}
