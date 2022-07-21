package it.pa.repdgt.opendata.mongo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.opendata.mongo.collection.SezioneQ3Collection;

@Repository
public interface SezioneQ3Repository extends MongoRepository<SezioneQ3Collection, String> {

	@Query(value="{'id' : ?0}")
	Optional<SezioneQ3Collection> findById(
			@Param(value = "id") String idSezioneQ3
		);
}