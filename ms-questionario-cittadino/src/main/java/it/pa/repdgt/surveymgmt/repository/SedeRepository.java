package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;

@Repository
public interface SedeRepository extends JpaRepository<SedeEntity, Long> {

	@Query(value = "SELECT DISTINCT "
			+ "           s.id as id "
			+ "         , s.nome as nome "
			+ "			FROM "
			+ "                              (SELECT DISTINCT "
			+ "                                        qc.sede_id "
			+ "                                      , qc.progetto_id "
			+ "                                      , qc.id_cittadino "
			+ "                                      , c.codice_fiscale "
			+ "                                      , c.num_documento "
			+ "                               FROM "
			+ "                                        questionario_compilato qc "
			+ "                               INNER JOIN "
			+ "                                        cittadino c "
			+ "                               ON "
			+ "                                        c.id = qc.id_cittadino"
			+ "                               WHERE  	1=1 "
			+ "  	  						  AND      ( COALESCE(:idsSedi)  	 IS NULL  OR sede_id IN (:idsSedi) ) "
			+ "								  )  "
			+ "           			 AS qc_cittadino "
			+ "			  INNER JOIN"
			+ "					sede s"
			+ "			  ON	qc_cittadino.sede_id = s.id"
			+ "			  INNER JOIN"
			+ "					progetto prgt"
			+ "			  ON	qc_cittadino.progetto_id = prgt.id"
			+ "			  INNER JOIN"
			+ "					programma prgm"
			+ "			  ON	prgt.id_programma = prgm.id"
			+ "                               WHERE 1=1"
			+ " 		                      AND (     :criterioRicerca IS NULL  "
			+ "			                      OR CONVERT( qc_cittadino.ID_CITTADINO, CHAR ) = :criterioRicerca "
			+ "		  	                      OR UPPER( qc_cittadino.CODICE_FISCALE ) = UPPER( :criterioRicerca ) "
			+ "		  	                      OR UPPER( qc_cittadino.NUM_DOCUMENTO ) = UPPER( :criterioRicerca )) ", nativeQuery = true)
	List<SedeProjection> findAllSediFiltrate(
			@Param("criterioRicerca") String criterioRicerca,
			@Param("idsSedi") List<String> idsSedi);

	Optional<SedeEntity> findByNomeIgnoreCase(String nominativoSede);

	@Query(value = ""
        + " SELECT "
        + " s "
        + " FROM "
        + " SedeEntity s "
        + " WHERE REPLACE(s.nome, ' ', '') = :nomeSedeModified "
        ,nativeQuery = false)
	Optional<SedeEntity> findSedeByNomeSedeModified(@Param(value = "nomeSedeModified") String nomeSedeModified);
}