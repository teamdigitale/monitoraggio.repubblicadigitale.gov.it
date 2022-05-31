package it.pa.repdgt.surveymgmt.service;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;

@Repository
public interface QuestionarioTemplateSqlRepository extends JpaRepository<QuestionarioTemplateEntity, String> {
	@Query(value = ""
			 	 + " SELECT "
			 	 + "	qt"
			 	 + " FROM QuestionarioTemplateEntity qt"
			 	 + " WHERE qt.nome = :nomeQuestionarioTemplate", 
		   nativeQuery = false)
	Optional<QuestionarioTemplateEntity> findQuestionarioTemplateByNome(
		@Param(value = "nomeQuestionarioTemplate") String nomeQuestionarioTemplate
	); 
}