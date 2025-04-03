package it.pa.repdgt.surveymgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ConfigurazioneMinorenniEntity;

@Repository
public interface ConfigurazioneMinorenniRepository extends JpaRepository<ConfigurazioneMinorenniEntity, Long> {

    @Query(value = "SELECT DISTINCT c.* " +
                   "FROM configurazione_minorenni c " +
                   "JOIN programma progr ON progr.id = c.id_programma " +
                   "JOIN progetto p ON p.id_programma = progr.id " +
                   "JOIN servizio s ON s.id_progetto = p.id " +
                   "WHERE (:idServizio IS NOT NULL AND s.id = :idServizio) " +
                   "OR (:idProgramma IS NOT NULL AND c.id_programma = :idProgramma)", 
           nativeQuery = true)
    Optional<ConfigurazioneMinorenniEntity> findConfigurazioneByIdServizioOrIdProgramma(
        Long idServizio,
        Long idProgramma
        );
}
