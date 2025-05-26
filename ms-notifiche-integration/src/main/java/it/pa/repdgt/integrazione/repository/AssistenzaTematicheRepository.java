package it.pa.repdgt.integrazione.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.integrazione.entity.AssistenzaTematicheEntity;

@Repository
public interface AssistenzaTematicheRepository extends JpaRepository<AssistenzaTematicheEntity, Long> {

}
