package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.QuestionarioTemplateSqlRepository;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;

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
		return this.questionarioTemplateSqlRepository.getReferenceById(idQuestionario);
	}

	public void salvaQuestionarioTemplate(QuestionarioTemplateEntity questionarioTemplate) {
		this.questionarioTemplateSqlRepository.save(questionarioTemplate);
	}

	public QuestionarioTemplateEntity getQuestionarioTemplateByPolicy(String policy) {
		if(policy.equals(PolicyEnum.RFD.getValue())) {
			return this.questionarioTemplateSqlRepository.findQuestionarioTemplateByPolicyRFD();
		}
		return this.questionarioTemplateSqlRepository.findQuestionarioTemplateByPolicySCD();

	}
}