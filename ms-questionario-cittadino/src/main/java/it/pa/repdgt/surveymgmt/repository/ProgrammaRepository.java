package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Repository
public interface ProgrammaRepository extends JpaRepository<ProgrammaEntity, Long> {

     @Query(value = "SELECT p.* \n" + 
                    "FROM programma p \n" + 
                    "LEFT JOIN configurazione_minorenni cm ON cm.id_programma = p.id \n" + 
                    "WHERE 1=1 \n" + 
                    "  AND p.policy = :policy\n" + 
                    "   AND p.stato != \"TERMINATO\"\r\n" + 
                    "  AND cm.id IS NULL\n" + 
                    "  AND (\n" + 
                    "        :criterioRicerca IS NULL  \n" + 
                    "        OR CAST(p.CODICE AS CHAR) = :criterioRicerca \n" + 
                    "        OR UPPER(CAST(p.NOME_BREVE AS CHAR)) LIKE UPPER(:criterioRicercaLike) \n" + 
                    "        OR UPPER(CAST(p.NOME AS CHAR)) LIKE UPPER(:criterioRicercaLike)\n" + 
                    "      )", nativeQuery = true)
    List<ProgrammaEntity> getAllProgrammiDaAbilitare(@Param(value = "criterioRicerca") String criterioRicerca, @Param(value = "criterioRicercaLike") String criterioRicercaLike, @Param(value = "policy") String policy);
 }