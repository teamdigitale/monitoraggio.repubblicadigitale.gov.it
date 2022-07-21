package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;

@Repository
public interface ProgrammaXQuestionarioTemplateRepository extends JpaRepository<ProgrammaXQuestionarioTemplateEntity, ProgrammaXQuestionarioTemplateKey>{

	@Query(value = ""
			+ "SELECT * "
			+ "	FROM "
			+ " programma_x_questionario_template pxqt "
			+ " WHERE "
			+ " pxqt.PROGRAMMA_ID = :idProgramma ",
			nativeQuery = true)
	List<ProgrammaXQuestionarioTemplateEntity> getAssociazioneQuestionarioTemplateByIdProgramma(@Param(value = "idProgramma") Long idProgramma); }
