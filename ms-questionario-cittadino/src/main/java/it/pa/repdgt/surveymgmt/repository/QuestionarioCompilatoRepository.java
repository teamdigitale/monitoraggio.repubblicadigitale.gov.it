package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;

@Repository
public interface QuestionarioCompilatoRepository extends JpaRepository<QuestionarioCompilatoEntity, String> {

	@Query(value = " "
			+ " SELECT "
			+ "	*"
			+ " FROM "
			+ "	questionario_compilato qc "
			+ " WHERE 1=1"
			+ "	AND qc.ID_CITTADINO = :idCittadino "
			+ "    AND qc.STATO <> 'COMPILATA'        ", nativeQuery = true)
	List<QuestionarioCompilatoEntity> findQuestionariCompilatiByCittadinoAndStatoNonCompilato(
			@Param(value = "idCittadino") Long idCittadino);
}