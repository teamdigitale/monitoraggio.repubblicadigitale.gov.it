package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.QuestionarioTemplateSqlRepository;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;

@Service
public class QuestionarioTemplateSqlService {
	
	@Autowired
	private QuestionarioTemplateSqlRepository questionarioTemplateSqlRepository;

	public boolean esisteQuestionarioById(String idQuestionario) {
		return this.questionarioTemplateSqlRepository.existsById(idQuestionario);
	}

	public List<QuestionarioTemplateEntity> getQuestionariByIdProgramma(Long idProgramma) {
		return this.questionarioTemplateSqlRepository.findQuestionariByIdProgramma(idProgramma);
	}

	public QuestionarioTemplateEntity getQuestionarioTemplateById(String idQuestionario) {
		return this.questionarioTemplateSqlRepository.getById(idQuestionario);
	}

	public void salvaQuestionarioTemplate(QuestionarioTemplateEntity questionarioTemplate) {
		this.questionarioTemplateSqlRepository.save(questionarioTemplate);
	}
}