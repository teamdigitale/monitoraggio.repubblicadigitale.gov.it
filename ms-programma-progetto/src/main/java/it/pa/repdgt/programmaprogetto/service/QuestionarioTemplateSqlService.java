package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.QuestionarioTemplateSqlRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;

@Service
public class QuestionarioTemplateSqlService {
	
	@Autowired
	private QuestionarioTemplateSqlRepository questionarioTemplateSqlRepository;

	@LogMethod
	@LogExecutionTime
	public boolean esisteQuestionarioById(String idQuestionario) {
		return this.questionarioTemplateSqlRepository.existsById(idQuestionario);
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getQuestionariByIdProgramma(Long idProgramma) {
		return this.questionarioTemplateSqlRepository.findQuestionariByIdProgramma(idProgramma);
	}

	@LogMethod
	@LogExecutionTime
	public QuestionarioTemplateEntity getQuestionarioTemplateById(String idQuestionario) {
		return this.questionarioTemplateSqlRepository.getReferenceById(idQuestionario);
	}

	@LogMethod
	@LogExecutionTime
	public void salvaQuestionarioTemplate(QuestionarioTemplateEntity questionarioTemplate) {
		this.questionarioTemplateSqlRepository.save(questionarioTemplate);
	}

	@LogMethod
	@LogExecutionTime
	public QuestionarioTemplateEntity getQuestionarioTemplateByPolicy(String policy) {
		if(policy.equals(PolicyEnum.RFD.getValue())) {
			return this.questionarioTemplateSqlRepository.findQuestionarioTemplateByPolicyRFD();
		}
		return this.questionarioTemplateSqlRepository.findQuestionarioTemplateByPolicySCD();
	}
}