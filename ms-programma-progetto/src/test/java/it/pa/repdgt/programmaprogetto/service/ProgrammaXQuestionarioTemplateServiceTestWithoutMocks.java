package it.pa.repdgt.programmaprogetto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.programmaprogetto.repository.ProgrammaXQuestionarioTemplateRepository;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class ProgrammaXQuestionarioTemplateServiceTestWithoutMocks {

	@Mock
	private ProgrammaXQuestionarioTemplateRepository programmaXQuestionarioTemplateRepository;
	@Mock
	ProgrammaXQuestionarioTemplateKey programmaXQuestionarioTemplateKey;
	@Mock
	ProgrammaXQuestionarioTemplateEntity programmaXQuestionarioTemplateEntity;
	
	@Autowired
	@InjectMocks
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	
	ProgrammaEntity programma1;
	QuestionarioTemplateEntity questionario1;
	
	@BeforeEach
	public void setUp() {
		programma1 = new ProgrammaEntity();
		programma1.setId(1L);
		programma1.setNome("programma1");
		questionario1 = new QuestionarioTemplateEntity();
		questionario1.setId("1L");
		questionario1.setNome("questionario1");
		programmaXQuestionarioTemplateKey = new ProgrammaXQuestionarioTemplateKey(programma1.getId(), questionario1.getId());
		programmaXQuestionarioTemplateEntity = new ProgrammaXQuestionarioTemplateEntity();
		programmaXQuestionarioTemplateEntity.setProgrammaXQuestionarioTemplateKey(programmaXQuestionarioTemplateKey);
		programmaXQuestionarioTemplateEntity.setStato("ATTIVO");
	}
	
	//test integrazione perché impossibile con i mock
	@Test
	public void associaQuestionarioTemplateAProgrammaTest() {
		programmaXQuestionarioTemplateService.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId());
		programmaXQuestionarioTemplateService.associaQuestionarioTemplateAProgramma(2L, "563847ffhgs");
	}
}
