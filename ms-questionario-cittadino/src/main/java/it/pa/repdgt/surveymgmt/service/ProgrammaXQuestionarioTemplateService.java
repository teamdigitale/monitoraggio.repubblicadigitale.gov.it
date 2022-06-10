package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.surveymgmt.repository.ProgrammaXQuestionarioTemplateRepository;

@Service
@Validated
public class ProgrammaXQuestionarioTemplateService {
	@Autowired
	private ProgrammaXQuestionarioTemplateRepository programmaXQuestionarioTemplateRepository;
	
	public List<ProgrammaXQuestionarioTemplateEntity> getByIdProgramma(
			@NotNull final Long idProgramma) {
		return this.programmaXQuestionarioTemplateRepository.findByIdProgramma(idProgramma);
	}
}