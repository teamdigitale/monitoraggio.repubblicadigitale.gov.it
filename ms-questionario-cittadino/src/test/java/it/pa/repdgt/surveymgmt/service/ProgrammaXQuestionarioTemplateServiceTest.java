package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
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

import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;
import it.pa.repdgt.surveymgmt.repository.ProgrammaXQuestionarioTemplateRepository;

@ExtendWith(MockitoExtension.class)
public class ProgrammaXQuestionarioTemplateServiceTest {

	/*
	 * @Mock
	 * private ProgrammaXQuestionarioTemplateRepository
	 * programmaXQuestionarioTemplateRepository;
	 * 
	 * @Autowired
	 * 
	 * @InjectMocks
	 * private ProgrammaXQuestionarioTemplateService
	 * programmaXQuestionarioTemplateService;
	 * 
	 * ProgrammaXQuestionarioTemplateKey programmaXQuestionarioTemplateKey;
	 * ProgrammaXQuestionarioTemplateEntity programmaXQuestionarioTemplateEntity;
	 * List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario;
	 * 
	 * @BeforeEach
	 * public void setUp() {
	 * programmaXQuestionarioTemplateKey = new ProgrammaXQuestionarioTemplateKey(1L,
	 * "IDQUESTIONARIO");
	 * programmaXQuestionarioTemplateEntity = new
	 * ProgrammaXQuestionarioTemplateEntity();
	 * programmaXQuestionarioTemplateEntity.setProgrammaXQuestionarioTemplateKey(
	 * programmaXQuestionarioTemplateKey);
	 * listaProgrammaXQuestionario = new ArrayList<>();
	 * listaProgrammaXQuestionario.add(programmaXQuestionarioTemplateEntity);
	 * }
	 * 
	 * @Test
	 * public void getByIdProgrammaTest() {
	 * when(this.programmaXQuestionarioTemplateRepository.findByIdProgramma(1L)).
	 * thenReturn(listaProgrammaXQuestionario);
	 * List<ProgrammaXQuestionarioTemplateEntity> risultato =
	 * programmaXQuestionarioTemplateService.getByIdProgramma(1L);
	 * assertThat(risultato.size()).isEqualTo(listaProgrammaXQuestionario.size());
	 * }
	 * 
	 * @Test
	 * public void deleteByQuestionarioTemplate() {
	 * doNothing().when(this.programmaXQuestionarioTemplateRepository).
	 * deleteByQuestionarioTemplate("IDQUESTIONARIO");
	 * programmaXQuestionarioTemplateService.deleteByQuestionarioTemplate(
	 * "IDQUESTIONARIO");
	 * }
	 */
}
