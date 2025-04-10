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
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Repository
public interface ConfigurazioneMinorenniRepository extends JpaRepository<ConfigurazioneMinorenniEntity, Long> {

    @Query(value = "SELECT DISTINCT c.* " +
                   "FROM configurazione_minorenni c " +
                   "JOIN programma progr ON progr.id = c.id_programma " +
                   "LEFT JOIN progetto p ON p.id_programma = progr.id " +
                   "LEFT JOIN servizio s ON s.id_progetto = p.id " +
                   "WHERE (:idServizio IS NOT NULL AND s.id = :idServizio) " +
                   "OR (:idProgramma IS NOT NULL AND c.id_programma = :idProgramma)", 
           nativeQuery = true)
    Optional<ConfigurazioneMinorenniEntity> findConfigurazioneByIdServizioOrIdProgramma(
        Long idServizio,
        Long idProgramma
        );

    @Query(value = "SELECT * FROM configurazione_minorenni \n", nativeQuery = true)
    Page<ConfigurazioneMinorenniEntity> getAllConfigurazioniPaginate(Pageable pageable);

    @Query(value = "SELECT * FROM configurazione_minorenni \n", nativeQuery = true)
    List<ConfigurazioneMinorenniEntity> getAllConfigurazioni();

    @Query(value = "SELECT p.* " +
                    "FROM programma p " +
                    "WHERE 1=1 " +
                    "  AND p.policy = :policy " +
                    "  AND ( " +
                    "        :criterioRicerca IS NULL " + 
                    "        OR CAST(p.CODICE AS CHAR) = :criterioRicerca " +
                    "        OR UPPER(CAST(p.NOME_BREVE AS CHAR)) LIKE UPPER(:criterioRicercaLike) " +
                    "        OR UPPER(CAST(p.NOME AS CHAR)) LIKE UPPER(:criterioRicercaLike) " +
                    "      )", nativeQuery = true)
    List<ProgrammaEntity> getAllProgrammiDaAbilitare(@Param(value = "criterioRicerca") String criterioRicerca, @Param(value = "criterioRicercaLike") String criterioRicercaLike, @Param(value = "intervento") String intervento);
}
