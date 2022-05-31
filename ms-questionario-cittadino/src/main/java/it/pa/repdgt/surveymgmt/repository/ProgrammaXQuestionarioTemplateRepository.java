package it.pa.repdgt.surveymgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;

@Repository
public interface ProgrammaXQuestionarioTemplateRepository extends JpaRepository<ProgrammaXQuestionarioTemplateEntity, ProgrammaXQuestionarioTemplateKey> {

	@Query(value = ""
			+ " SELECT "
			+ "		questionario_Template.NOME"
			+ " FROM "
			+ "		PROGRAMMA_X_QUESTIONARIO_TEMPLATE programma_x_questionario_templ "
			+ "		INNER JOIN QUESTIONARIO_TEMPLATE questionario_Template "
			+ "		ON questionario_Template.ID = programma_x_questionario_templ.QUESTIONARIO_TEMPLATE_ID "
			+ " WHERE 1=1 "
			+ "   AND programma_x_questionario_templ.PROGRAMMA_ID  = :idProgramma",
			nativeQuery = true)
	String findNomeQuestionarioTemplateByIdProgramma(Long idProgramma);
}