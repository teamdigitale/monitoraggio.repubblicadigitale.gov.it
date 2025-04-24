package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ConfigurazioneMinorenniEntity;
import it.pa.repdgt.surveymgmt.dto.ConfigurazioneMinorenniDto;

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

    @Query(value = "SELECT cm.*, p.nome AS nome_programma \n" +
                    "FROM configurazione_minorenni cm \n" +
                    "JOIN programma p ON cm.id_programma = p.id \n"
                    ,
                    countQuery = "SELECT COUNT(*) \n" +
                    "FROM configurazione_minorenni cm \n" +
                    "JOIN programma p ON cm.id_programma = p.id",
                    nativeQuery = true)
    Page<Object[]> getAllConfigurazioniPaginate(Pageable pageable);

    @Query(value = "SELECT cm.*, p.nome AS nome_programma \n" +
            "FROM configurazione_minorenni cm \n" +
            "JOIN programma p ON cm.id_programma = p.id \n", nativeQuery = true)
    List<ConfigurazioneMinorenniDto> getAllConfigurazioni();

    @Query(value = "SELECT * FROM configurazione_minorenni \n" + 
                   "WHERE id_programma = :idProgramma", nativeQuery = true)
    Optional<ConfigurazioneMinorenniEntity> getConfigurazioneMinorenniByIdProgramma(@Param(value = "idProgramma") Long idProgramma);

}
