package it.pa.repdgt.surveymgmt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.surveymgmt.repository.ProgrammaXQuestionarioTemplateRepository;

@Service
public class ProgrammaXQuestionarioTemplateService {
	@Autowired
	private ProgrammaXQuestionarioTemplateRepository programmaXQuestionarioTemplateRepository;
	
	public String getNomeQuestionarioTemplateByIdProgramma(final Long idProgramma) {
		return this.programmaXQuestionarioTemplateRepository.findNomeQuestionarioTemplateByIdProgramma(idProgramma);
	}
}