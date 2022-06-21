package it.pa.repdgt.surveymgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.EnteEntity;

@Repository
public interface EnteRepository extends JpaRepository<EnteEntity, Long> { }