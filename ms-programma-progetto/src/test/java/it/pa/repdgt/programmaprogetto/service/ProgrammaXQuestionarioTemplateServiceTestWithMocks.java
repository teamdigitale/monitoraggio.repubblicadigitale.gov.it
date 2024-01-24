package it.pa.repdgt.programmaprogetto.service;

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

import it.pa.repdgt.programmaprogetto.repository.ProgrammaXQuestionarioTemplateRepository;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;

//@ExtendWith(MockitoExtension.class)
class ProgrammaXQuestionarioTemplateServiceTestWithMocks {

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
	List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario;

	@BeforeEach
	public void setUp() {
		programma1 = new ProgrammaEntity();
		programma1.setId(1L);
		programma1.setNome("programma1");
		questionario1 = new QuestionarioTemplateEntity();
		questionario1.setId("1L");
		questionario1.setNome("questionario1");
		programmaXQuestionarioTemplateKey = new ProgrammaXQuestionarioTemplateKey(programma1.getId(),
				questionario1.getId());
		programmaXQuestionarioTemplateEntity = new ProgrammaXQuestionarioTemplateEntity();
		programmaXQuestionarioTemplateEntity.setProgrammaXQuestionarioTemplateKey(programmaXQuestionarioTemplateKey);
		programmaXQuestionarioTemplateEntity.setStato("ATTIVO");
		listaProgrammaXQuestionario = new ArrayList<>();
		listaProgrammaXQuestionario.add(programmaXQuestionarioTemplateEntity);
	}

	// @Test
	public void terminaAssociazioneQuestionarioTemplateAProgrammaTest() {
		when(programmaXQuestionarioTemplateRepository.save(programmaXQuestionarioTemplateEntity))
				.thenReturn(programmaXQuestionarioTemplateEntity);
		programmaXQuestionarioTemplateService
				.terminaAssociazioneQuestionarioTemplateAProgramma(programmaXQuestionarioTemplateEntity);
		verify(programmaXQuestionarioTemplateRepository, times(1)).save(programmaXQuestionarioTemplateEntity);
	}

	// @Test
	public void getAssociazioneQuestionarioTemplateByIdProgrammaTest() {
		when(programmaXQuestionarioTemplateRepository
				.getAssociazioneQuestionarioTemplateByIdProgramma(programma1.getId()))
				.thenReturn(listaProgrammaXQuestionario);
		programmaXQuestionarioTemplateService.getAssociazioneQuestionarioTemplateByIdProgramma(programma1.getId());
		verify(programmaXQuestionarioTemplateRepository, times(1))
				.getAssociazioneQuestionarioTemplateByIdProgramma(programma1.getId());
	}

	// @Test
	public void cancellaAssociazioneQuestionarioTemplateAProgrammaTest() {
		when(programmaXQuestionarioTemplateRepository
				.getAssociazioneQuestionarioTemplateByIdProgramma(programma1.getId()))
				.thenReturn(listaProgrammaXQuestionario);
		programmaXQuestionarioTemplateService.cancellaAssociazioneQuestionarioTemplateAProgramma(programma1.getId());
		verify(programmaXQuestionarioTemplateRepository, times(1)).delete(programmaXQuestionarioTemplateEntity);
	}
}
