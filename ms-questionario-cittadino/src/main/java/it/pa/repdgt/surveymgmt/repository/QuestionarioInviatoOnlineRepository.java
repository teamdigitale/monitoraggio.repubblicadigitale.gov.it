package it.pa.repdgt.surveymgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.QuestionarioInviatoOnlineEntity;

@Repository
public interface QuestionarioInviatoOnlineRepository extends JpaRepository<QuestionarioInviatoOnlineEntity, String> {

	public Optional<QuestionarioInviatoOnlineEntity> findByIdQuestionarioCompilatoAndCodiceFiscale(String idQuestionarioCompilato, String codiceFiscaleCittadino);
	
	public Optional<QuestionarioInviatoOnlineEntity> findByIdQuestionarioCompilatoAndToken(String idQuestionarioCompilato, String token);
	
	public Optional<QuestionarioInviatoOnlineEntity> findByIdQuestionarioCompilatoAndNumDocumento(String idQuestionarioCompilato, String numDocumento);
}