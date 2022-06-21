package it.pa.repdgt.surveymgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;

public interface QuestionarioCompilatoSqlRepository extends JpaRepository<QuestionarioCompilatoEntity, String> { }