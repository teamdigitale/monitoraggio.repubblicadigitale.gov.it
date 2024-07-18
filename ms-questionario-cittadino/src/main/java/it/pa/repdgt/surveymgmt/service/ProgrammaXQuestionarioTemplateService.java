package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.surveymgmt.repository.ProgrammaXQuestionarioTemplateRepository;

@Service
@Validated
public class ProgrammaXQuestionarioTemplateService {
	@Autowired
	private ProgrammaXQuestionarioTemplateRepository programmaXQuestionarioTemplateRepository;
	
	@LogMethod
	@LogExecutionTime
	public List<ProgrammaXQuestionarioTemplateEntity> getByIdProgramma(
			@NotNull final Long idProgramma) {
		return this.programmaXQuestionarioTemplateRepository.findByIdProgramma(idProgramma);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional
	public void deleteByQuestionarioTemplate(
			@NotNull final String idQuestionarioTemplate) {
		this.programmaXQuestionarioTemplateRepository.deleteByQuestionarioTemplate(idQuestionarioTemplate);
	}
}