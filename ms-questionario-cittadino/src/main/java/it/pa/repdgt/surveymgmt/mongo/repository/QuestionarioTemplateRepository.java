package it.pa.repdgt.surveymgmt.mongo.repository;

import java.util.Optional;

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
	
	@Query(value="{'id' : ?0}", delete = true)
	void deleteByIdQuestionarioTemplate(
			String idQuestionarioTemplate
		);
}