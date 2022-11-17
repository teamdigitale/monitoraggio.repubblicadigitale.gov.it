package it.pa.repdgt.integrazione.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;

@Repository
public interface ProgrammaRepository extends JpaRepository<ProgrammaEntity, Long> {
	public List<ProgrammaEntity> findByPolicy(PolicyEnum policy);
}