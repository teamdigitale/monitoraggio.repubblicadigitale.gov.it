package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.programmaprogetto.repository.QuestionarioTemplateSqlRepository;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;

//@ExtendWith(MockitoExtension.class)
public class QuestionarioTemplateSqlServiceTest {

	@Mock
	private QuestionarioTemplateSqlRepository questionarioTemplateSqlRepository;

	@Autowired
	@InjectMocks
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;

	QuestionarioTemplateEntity questionario1;
	ProgrammaEntity programma1;
	List<QuestionarioTemplateEntity> listaQuestionari;

	@BeforeEach
	public void setUp() {
		questionario1 = new QuestionarioTemplateEntity();
		questionario1.setId("1L");
		questionario1.setNome("questionario1");
		programma1 = new ProgrammaEntity();
		programma1.setId(1L);
		programma1.setNome("programma1");
		listaQuestionari = new ArrayList<>();
		listaQuestionari.add(questionario1);
	}

	// @Test
	public void esisteQuestionarioByIdTest() {
		when(questionarioTemplateSqlRepository.existsById(questionario1.getId())).thenReturn(true);
		questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId());
		verify(questionarioTemplateSqlRepository, times(1)).existsById(questionario1.getId());
	}

	// @Test
	public void getQuestionariByIdProgrammaTest() {
		when(questionarioTemplateSqlRepository.findQuestionariByIdProgramma(programma1.getId())).thenReturn(listaQuestionari);
		questionarioTemplateSqlService.getQuestionariByIdProgramma(programma1.getId());
		assertThat(listaQuestionari.size()).isEqualTo(1);
		verify(questionarioTemplateSqlRepository, times(1)).findQuestionariByIdProgramma(programma1.getId());
	}

	// @Test
	public void getQuestionarioTemplateByIdTest() {
		when(questionarioTemplateSqlRepository.getReferenceById(questionario1.getId())).thenReturn(questionario1);
		questionarioTemplateSqlService.getQuestionarioTemplateById(questionario1.getId());
		verify(questionarioTemplateSqlRepository, times(1)).getReferenceById(questionario1.getId());
	}

	// @Test
	public void salvaQuestionarioTemplateTest() {
		when(questionarioTemplateSqlRepository.save(questionario1)).thenReturn(questionario1);
		questionarioTemplateSqlService.salvaQuestionarioTemplate(questionario1);
		verify(questionarioTemplateSqlRepository, times(1)).save(questionario1);
	}

	// @Test
	public void getQuestionarioTemplateByPolicyRFDTest() {
		when(questionarioTemplateSqlRepository.findQuestionarioTemplateByPolicyRFD()).thenReturn(questionario1);
		questionarioTemplateSqlService.getQuestionarioTemplateByPolicy(PolicyEnum.RFD.getValue());
		verify(questionarioTemplateSqlRepository, times(1)).findQuestionarioTemplateByPolicyRFD();
	}

	// @Test
	public void getQuestionarioTemplateByPolicySCDTest() {
		when(questionarioTemplateSqlRepository.findQuestionarioTemplateByPolicySCD()).thenReturn(questionario1);
		questionarioTemplateSqlService.getQuestionarioTemplateByPolicy(PolicyEnum.SCD.getValue());
		verify(questionarioTemplateSqlRepository, times(1)).findQuestionarioTemplateByPolicySCD();
	}
}
