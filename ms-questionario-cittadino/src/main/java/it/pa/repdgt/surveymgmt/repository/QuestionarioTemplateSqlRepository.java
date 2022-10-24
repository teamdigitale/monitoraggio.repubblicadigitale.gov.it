package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;

@Repository
public interface QuestionarioTemplateSqlRepository extends JpaRepository<QuestionarioTemplateEntity, String> {

	@Query(value = ""
			+ " SELECT "
			+ "		count(*) "
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
	Long countQuestionarioTemplateByFiltro(
			@Param(value = "criterioRicerca")   String criterioRicerca,
			@Param(value = "statoQuestionario") String statoQuestionario
		); 
	
	@Query(value = ""
			+ " SELECT "
			+ "		qt.* , "
			+ "     case "
			+ "     when qt.default_rfd = true "
			+ "     then '1' "
			+ "     else '2' "
			+ "     end as rfd,  "
			+ "     case "
			+ "     when qt.default_scd = true "
			+ "     then '1' "
			+ "     else '2' "
			+ "     end as scd"
			+ " FROM "
			+ "		questionario_template qt "
			+ " WHERE 1=1 "
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "	
	        + "			OR qt.ID LIKE :criterioRicerca "
	        + "	   		OR UPPER(qt.NOME) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )"
            + "   ORDER BY rfd,scd ,data_ora_aggiornamento desc"
            + "	  LIMIT :currPage, :pageSize",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findAllByFiltro(
			@Param(value = "criterioRicerca")   String criterioRicerca,
			@Param(value = "statoQuestionario") String statoQuestionario,
			@Param(value = "currPage") Integer currPage,
			@Param(value = "pageSize") Integer pageSize
		); 
	
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
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )"
            + "	  LIMIT :currPage, :pageSize",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionariTemplateByIdProgrammaAndFiltro(
			@Param(value = "idProgramma") Long idProgramma,
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "statoQuestionario") String statoQuestionario,
			@Param(value = "currPage") Integer currPage,
			@Param(value = "pageSize") Integer pageSize
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
			+ "		questionario_template qt "
			+ " WHERE 1=1 "
			+ "   AND qt.default_scd = TRUE "
			+ "   AND ( "
			+ "			:criterioRicerca IS NULL  "
	        + "			OR qt.id LIKE :criterioRicerca "
	        + "	   		OR UPPER(qt.nome) LIKE UPPER( :criterioRicerca ) "
            + "   ) "
            + "	  AND  ( :statoQuestionario IS NULL  OR  qt.stato = :statoQuestionario )"
            + "	  LIMIT :currPage, :pageSize",
			nativeQuery = true)
	List<QuestionarioTemplateEntity> findQuestionariTemplateByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario,
			Integer currPage,
			Integer pageSize);
	
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
			String statoQuestionario
		);
	
	@Query(value = ""
			+ " SELECT "
			+ "		qt.stato "
			+ " FROM "
			+ "		questionario_template qt "
			+ " WHERE 1=1 "
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

	Optional<QuestionarioTemplateEntity> findByNome(String nomeQuestionarioTemplate);

	@Query(value = ""
			+ " SELECT * "
			+ "	FROM questionario_template qt "
			+ "	WHERE qt.nome = :nomeQuestionarioTemplate "
			+ "		AND qt.id <> :idQuestionarioTemplate",
			nativeQuery = true)
	Optional<QuestionarioTemplateEntity> findQuestionarioTemplateByNomeAndIdDiverso(
			String nomeQuestionarioTemplate,
			String idQuestionarioTemplate);
}