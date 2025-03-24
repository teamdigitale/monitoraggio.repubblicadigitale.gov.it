package it.pa.repdgt.surveymgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.CittadinoEntity;

@Repository
public interface ConfigurazioneMinorenniRepository extends JpaRepository<ConfigurazioneMinorenniEntity, Long> {

    @Query(value = "SELECT p.id_programma FROM servizio s JOIN progetto p ON s.id_progetto = p.id JOIN configurazione_minorenni c ON c.id_programma = p.id_programma WHERE s.id = :idServizio", nativeQuery = true) //TODO definire la query
    public Optional<ConfigurazioneMinorenniEntity> findByIdServizio(Long idServizio);
}
