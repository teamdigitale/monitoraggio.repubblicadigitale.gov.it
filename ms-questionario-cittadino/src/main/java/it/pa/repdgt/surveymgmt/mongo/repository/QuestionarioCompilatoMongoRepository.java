package it.pa.repdgt.surveymgmt.mongo.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;

@Repository
public interface QuestionarioCompilatoMongoRepository extends MongoRepository<QuestionarioCompilatoCollection, String> {

	@Query(value="{'id' : ?0}")
	Optional<QuestionarioCompilatoCollection> findQuestionarioCompilatoById(
			 String idQuestionario
		);
	
	@Query(value="{'id' : ?0}", delete = true)
	void deleteByIdQuestionarioTemplate(
			String idQuestionarioTemplate
		);

}