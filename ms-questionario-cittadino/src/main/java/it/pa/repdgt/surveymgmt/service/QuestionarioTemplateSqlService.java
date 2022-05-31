package it.pa.repdgt.surveymgmt.service;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;

@Service
@Validated
public class QuestionarioTemplateSqlService {
	@Autowired
	private QuestionarioTemplateSqlRepository templateQuestionarioSqlRepository;

	public boolean esisteQuestionarioTemplateByNome(@NotBlank final String nomeQuestionarioTemplate) {
		return this.templateQuestionarioSqlRepository
				.findQuestionarioTemplateByNome(nomeQuestionarioTemplate)
				.isPresent();
	}
	
	@Transactional(rollbackFor = Exception.class)
	public QuestionarioTemplateEntity salvaQuestionarioTemplate(@NotNull final QuestionarioTemplateEntity questionarioTemplateEntity) {
		final String nomeQuestionario = questionarioTemplateEntity.getNome();
		if(this.esisteQuestionarioTemplateByNome(nomeQuestionario)) {
			final String messaggioErrore = String.format("Impossibile salvare il questionario. Questionario con nome='%s' già presente", 
					nomeQuestionario);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		return this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity);
	}
}