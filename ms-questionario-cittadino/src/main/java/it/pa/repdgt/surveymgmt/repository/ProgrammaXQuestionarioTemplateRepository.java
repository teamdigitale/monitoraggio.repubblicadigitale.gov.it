package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;

public interface ProgrammaXQuestionarioTemplateRepository extends JpaRepository<ProgrammaXQuestionarioTemplateEntity, ProgrammaXQuestionarioTemplateKey> {

	@Query(value = ""
				 + " SELECT "
				 + "	* "
				 + " FROM "
				 + "	programma_x_questionario_template pxqt "
				 + " WHERE 1=1 "
				 + " 	AND pxqt.PROGRAMMA_ID = :idProgramma ",
		   nativeQuery = true)
	List<ProgrammaXQuestionarioTemplateEntity> findByIdProgramma(
			@Param(value = "idProgramma") Long idProgramma);

	@Modifying
	@Query(value = ""
			 + " DELETE "
			 + " FROM   "
			 + "	programma_x_questionario_template pxqt "
			 + " WHERE 1=1 "
			 + " 	AND pxqt.questionario_template_id = :idQuestionarioTemplate ",
	   nativeQuery = true)
	void deleteByQuestionarioTemplate(@Param(value = "idQuestionarioTemplate") String idQuestionarioTemplate); }