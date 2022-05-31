package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;

@Repository
public interface QuestionarioTemplateSqlRepository extends JpaRepository<QuestionarioTemplateEntity, String>{

	@Query(value = "SELECT * "
			+ "FROM questionario_template qt "
			+ "	INNER JOIN programma_x_questionario_template pxqt "
			+ "		ON pxqt.QUESTIONARIO_TEMPLATE_ID  = qt.ID "
			+ "WHERE pxqt.PROGRAMMA_ID = :idProgramma ", 
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionariByIdProgramma(Long idProgramma);

}
