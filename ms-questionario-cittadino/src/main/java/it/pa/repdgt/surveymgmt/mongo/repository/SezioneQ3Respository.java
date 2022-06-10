package it.pa.repdgt.surveymgmt.mongo.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;

@Repository
public interface SezioneQ3Respository extends MongoRepository<SezioneQ3Collection, String> {

	@Query(value="{'id' : ?0}")
	Optional<SezioneQ3Collection> findById(
			@Param(value = "id") String idSezioneQ3
		);

	@Query(value="{'id' : ?0}", delete = true)
	void deleteById(
		@Param(value = "id") String idSezioneQ3
	);
}