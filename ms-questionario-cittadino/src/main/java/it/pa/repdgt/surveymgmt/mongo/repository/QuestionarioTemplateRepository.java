package it.pa.repdgt.surveymgmt.mongo.repository;

import java.util.Optional;

import javax.validation.constraints.NotNull;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;

@Repository
public interface QuestionarioTemplateRepository extends MongoRepository<QuestionarioTemplateCollection, String> {
	@Query(value="{'id' : ?0}")
	Optional<QuestionarioTemplateCollection> findTemplateQuestionarioById(
			@Param(value = "id") String idQuestionario
		);
	
	@Query(value="{'id' : ?0}")
	Page<QuestionarioTemplateCollection> findTemplateQuestionarioPaginatiById(
			@Param(value = "id") String idQuestionario,
			Pageable pagina
		);
	
	@Query(value="{'nome' : ?0}")
	Optional<QuestionarioTemplateCollection> findTemplateQuestionarioByNome(
			@Param(value = "survey-name") String nomeQuestionario
		);

	
	@Query(value="{ 'nome' : /.*?0.*/ }")
	Page<QuestionarioTemplateCollection> findAllPaginatiByCriterioRicerca(
			@Param(value = "criterioRicerca") String criterioRicerca,
			Pageable pagina
		);

	@Query(value="{ 'nome' : /.*?0.*/, 'stato' : ?1 }")
	Page<QuestionarioTemplateCollection> findAllPaginatiByCriterioRicercaAndStato(
			@Param(value = "criterioRicerca") String criterioRicerca,
			@Param(value = "stato") String statoQuestionarioTemplate,
			Pageable pagina
		);

	@Query(value="{'nome' : ?0}")
	Page<QuestionarioTemplateCollection> findByNomeQuestionarioPaginati(
			String nomeQuestionarioTemplate,
			@NotNull Pageable pagina
	);
	
	@Query(value="{'stato' : ?0}")
	Page<QuestionarioTemplateCollection> findByStatoPaginati(
			String statoQuestionarioTemplate,
			@NotNull Pageable pagina
	);
}