package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;

@Repository
public interface QuestionarioTemplateSqlRepository extends JpaRepository<QuestionarioTemplateEntity, String> {

	@Query(value = ""
			+ " SELECT "
			+ "		qt.* "
			+ " FROM "
			+ "		questionario_template qt "
			+ " WHERE 1=1 "
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "	
	        + "			OR qt.ID LIKE :criterioRicerca "
	        + "	   		OR UPPER(qt.NOME) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findAllByFiltro(
			@Param(value = "criterioRicerca")   String criterioRicerca,
			@Param(value = "statoQuestionario") String statoQuestionario
		); 
	
	@Query(value = ""
			+ " SELECT "
			+ "		DISTINCT qt.stato "
			+ " FROM "
			+ "		questionario_template qt "
			+ " WHERE 1=1 "
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "	
	        + "			OR qt.ID LIKE :criterioRicerca "
	        + "	   		OR UPPER(qt.NOME) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )",
			nativeQuery = true)
	List<String> findAllStatiDropdownByFiltro(
			@Param(value = "criterioRicerca")   String criterioRicerca,
			@Param(value = "statoQuestionario") String statoQuestionario
		); 
	
	@Query(value = ""
			+ " SELECT "
			+ "		qt.* "
			+ " FROM "
			+ "		programma_x_questionario_template pqt "
			+ "		INNER JOIN questionario_template qt "
			+ "		ON qt.id = pqt.questionario_template_id "
			+ " WHERE 1=1 "
			+ "   AND pqt.stato = 'ATTIVO'"
			+ "   AND pqt.programma_id = :idProgramma"
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "
	        + "			OR UPPER(qt.id) LIKE UPPER(:criterioRicerca) "
	        + "	   		OR UPPER(qt.nome) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionariTemplateByIdProgrammaAndFiltro(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "statoQuestionario") String statoQuestionario
		);
	
	@Query(value = ""
			+ " SELECT "
			+ "		qt.stato "
			+ " FROM "
			+ "		programma_x_questionario_template pqt "
			+ "		INNER JOIN questionario_template qt "
			+ "		ON qt.id = pqt.questionario_template_id "
			+ " WHERE 1=1 "
			+ "   AND pqt.stato = 'ATTIVO'"
			+ "   AND pqt.programma_id = :idProgramma"
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "
	        + "			OR UPPER(qt.id) LIKE UPPER(:criterioRicerca) "
	        + "	   		OR UPPER(qt.nome) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )",
			nativeQuery = true)
	List<String> findStatiDropdownByIdProgrammaAndFiltro(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "statoQuestionario") String statoQuestionario
		);

	@Query(value ="SELECT * "
			+ "FROM questionario_template qt "
			+ "WHERE qt.DEFAULT_SCD = true ",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionariSCD();

	@Query(value ="SELECT * "
			+ "FROM questionario_template qt "
			+ "WHERE qt.DEFAULT_RFD = true ",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionariRFD();

	@Query(value = ""
			+ " SELECT "
			+ "		qt.* "
			+ " FROM "
			+ "		programma_x_questionario_template pqt "
			+ "		INNER JOIN questionario_template qt "
			+ "		ON qt.id = pqt.QUESTIONARIO_TEMPLATE_ID "
			+ " WHERE 1=1 "
			+ "   AND pqt.stato = 'ATTIVO' "
			+ "   AND qt.default_scd = TRUE "
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "
	        + "			OR qt.id LIKE :criterioRicerca "
	        + "	   		OR UPPER(qt.nome) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionariTemplateByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario);
	
	@Query(value = ""
			+ " SELECT "
			+ "		qt.stato "
			+ " FROM "
			+ "		programma_x_questionario_template pqt "
			+ "		INNER JOIN questionario_template qt "
			+ "		ON qt.id = pqt.QUESTIONARIO_TEMPLATE_ID "
			+ " WHERE 1=1 "
			+ "   AND pqt.stato = 'ATTIVO' "
			+ "   AND qt.default_scd = TRUE "
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "
	        + "			OR qt.id LIKE :criterioRicerca "
	        + "	   		OR UPPER(qt.nome) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )",
			nativeQuery = true)
	List<String> findStatiDropdownByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario);

	@Query(value = "SELECT * "
			+ "FROM questionario_template "
			+ "WHERE default_rfd = true ", 
			nativeQuery = true)
	Optional<QuestionarioTemplateEntity> findQuestionarioTemplateDefaultRFD();

	@Query(value = "SELECT * "
			+ "FROM questionario_template "
			+ "WHERE default_scd = true ", 
			nativeQuery = true)
	Optional<QuestionarioTemplateEntity> findQuestionarioTemplateDefaultSCD();

	@Query(value = ""
			+ " SELECT "
			+ "		qt.* "
			+ " FROM "
			+ "		progetto pgt "
			+ "		INNER JOIN programma pgm "
			+ "		ON pgm.ID = pgt.ID_PROGRAMMA"
			+ "		INNER JOIN programma_x_questionario_template pqt"
			+ "		ON pqt.PROGRAMMA_ID = pgm.ID"
			+ " WHERE 1=1 "
			+ "		AND pgt.ID = :idProgetto",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionarioTemplateByIdProgetto(
			@Param(value = "idProgetto") Long idProgetto
		);
}