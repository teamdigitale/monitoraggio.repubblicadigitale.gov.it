package it.pa.repdgt.surveymgmt.mongo.repository;

import java.util.Date;
import java.util.Optional;

import javax.validation.constraints.NotNull;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;

@Repository
public interface QuestionarioTemplateRepository extends MongoRepository<QuestionarioTemplateCollection, String> {
	@Query(value="{'id' : ?0}")
	Optional<QuestionarioTemplateCollection> findTemplateQuestionarioById(
			@Param(value = "id") String idQuestionario
		);
	
	@Query(value="{'nome' : ?0}")
	Optional<QuestionarioTemplateCollection> findTemplateQuestionarioByNome(
			@Param(value = "survey-name") String nomeQuestionario
		);
	
	@Query(value="{'id' : ?0}", delete = true)
	void deleteByIdQuestionarioTemplate(
			String idQuestionarioTemplate
		);
	
	@Query(value=" {"
				+"	 $and: ["
			    +"   	{'id' : ?0}, "
			    +"   	{'dataOraAggiornamento' : {$gte : ?1}}"
			    +"	 ]"
			    +" } ")
	void deleteByIdQuestionarioTemplateAndDataMaggiore(
			@NotNull String idQuestionarioTemplate, 
			@NotNull Date dataQueestionarioTemplate
		);
	
	@Query(value=" {"
			+"	 $and: ["
		    +"   	{'id' : ?0}, "
		    +"   	{'dataOraAggiornamento' : {$lte : ?1}}"
		    +"	 ]"
		    +" } ")
	void deleteByIdQuestionarioTemplateAndDataMinore(
			@NotNull String idQuestionarioTemplate, 
			@NotNull Date dataQueestionarioTemplate
		);
}