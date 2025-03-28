package it.pa.repdgt.surveymgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.CittadinoEntity;

@Repository
public interface ConfigurazioneMinorenniRepository extends JpaRepository<ConfigurazioneMinorenniEntity, Long> {

    // @Query(value = "SELECT c FROM servizio s JOIN progetto p ON s.id_progetto =
    // p.id JOIN configurazione_minorenni c ON c.id_programma = p.id_programma WHERE
    // s.id = :idServizio", nativeQuery = true)
    // @Query(value = "SELECT c FROM configurazione_minorenni c WHERE c.id_programma
    // = :idProgramma", nativeQuery = true)
    // public Optional<ConfigurazioneMinorenniEntity> findByIdServizio(Long
    // idServizio, Long idProgramma);

    @Query(value = "SELECT c FROM configurazione_minorenni c " +
            "LEFT JOIN programma p ON c.id_programma = p.id_programma " +
            "LEFT JOIN servizio s ON s.id_progetto = p.id " +
            "WHERE (:idServizio IS NOT NULL AND s.id = :idServizio) " +
            "   OR (:idProgramma IS NOT NULL AND c.id_programma = :idProgramma)", nativeQuery = true)
    Optional<ConfigurazioneMinorenniEntity> findConfigurazioneByIdServizioOrIdProgramma(
        Long idServizio,
        Long idProgramma
        );
}
