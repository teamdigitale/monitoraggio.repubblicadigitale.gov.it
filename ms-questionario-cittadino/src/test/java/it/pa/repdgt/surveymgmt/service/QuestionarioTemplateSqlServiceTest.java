package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.param.FiltroListaQuestionariTemplateParam;
import it.pa.repdgt.surveymgmt.repository.QuestionarioTemplateSqlRepository;

@ExtendWith(MockitoExtension.class)
public class QuestionarioTemplateSqlServiceTest {
	
	@Mock
	private ProgrammaService programmaService;
	@Mock
	private QuestionarioTemplateSqlRepository templateQuestionarioSqlRepository;

	@Autowired
	@InjectMocks
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;
	
	QuestionarioTemplateEntity questionarioTemplateEntity;
	FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate;
	List<QuestionarioTemplateEntity> listaQuestionari;
	ProgrammaEntity programma;
	
	@BeforeEach
	public void setUp() {
		questionarioTemplateEntity = new QuestionarioTemplateEntity();
		questionarioTemplateEntity.setId("IDQUESTIONARIO");
		filtroListaQuestionariTemplate = new FiltroListaQuestionariTemplateParam();
		filtroListaQuestionariTemplate.setCriterioRicerca("CRITERIORICERCA");
		filtroListaQuestionariTemplate.setCurrPage(0);
		filtroListaQuestionariTemplate.setPageSize(10);
		filtroListaQuestionariTemplate.setStatoQuestionario("ATTIVO");
		listaQuestionari = new ArrayList<>();
		listaQuestionari.add(questionarioTemplateEntity);
		programma = new ProgrammaEntity();
		programma.setId(1L);
	}
	
	@Test
	public void getNumeroTotaleQuestionariTemplateByFiltroTest() {
		when(this.templateQuestionarioSqlRepository.countQuestionarioTemplateByFiltro("CRITERIORICERCA", "ATTIVO")).thenReturn(1L);
		questionarioTemplateSqlService.getNumeroTotaleQuestionariTemplateByFiltro("CRITERIORICERCA", "ATTIVO");
	}
	
	@Test
	public void getQuestionariTemplateByIdProgettoTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionarioTemplateByIdProgetto(1L)).thenReturn(new ArrayList<>());
		questionarioTemplateSqlService.getQuestionariTemplateByIdProgetto(1L);
	}
	
	@Test
	public void salvaQuestionarioTemplateTest() {
		when(this.templateQuestionarioSqlRepository.existsById(questionarioTemplateEntity.getId())).thenReturn(false);
		when(this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity)).thenReturn(questionarioTemplateEntity);
		QuestionarioTemplateEntity risultato = questionarioTemplateSqlService.salvaQuestionarioTemplate(questionarioTemplateEntity);
		assertThat(risultato.getId()).isEqualTo(questionarioTemplateEntity.getId());
	}
	
	@Test
	public void salvaQuestionarioTemplateKOTest() {
		//test KO per questionario già presente
		when(this.templateQuestionarioSqlRepository.existsById(questionarioTemplateEntity.getId())).thenReturn(true);
		Assertions.assertThrows(QuestionarioTemplateException.class, () -> questionarioTemplateSqlService.salvaQuestionarioTemplate(questionarioTemplateEntity));
		assertThatExceptionOfType(QuestionarioTemplateException.class);
	}
	
	@Test
	public void aggiornaQuestionarioTemplateTest() {
		when(this.templateQuestionarioSqlRepository.findById(questionarioTemplateEntity.getId())).thenReturn(Optional.of(questionarioTemplateEntity));
		when(this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity)).thenReturn(questionarioTemplateEntity);
		QuestionarioTemplateEntity risultato = questionarioTemplateSqlService.aggiornaQuestionarioTemplate(questionarioTemplateEntity);
		assertThat(risultato.getId()).isEqualTo(questionarioTemplateEntity.getId());
	}
	
	@Test
	public void aggiornaQuestionarioTemplateKOTest() {
		//test KO per questionario non trovato
		when(this.templateQuestionarioSqlRepository.findById(questionarioTemplateEntity.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(QuestionarioTemplateException.class, () -> questionarioTemplateSqlService.aggiornaQuestionarioTemplate(questionarioTemplateEntity));
		assertThatExceptionOfType(QuestionarioTemplateException.class);
	}
	
	@Test
	public void findAllQuestionariTemplatePaginatiByFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findAllByFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.findAllQuestionariTemplatePaginatiByFiltro(filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize());
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void findAllQuestionariTemplateByFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findAllByFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.findAllQuestionariTemplateByFiltro(filtroListaQuestionariTemplate.getCriterioRicerca(), filtroListaQuestionariTemplate.getStatoQuestionario());
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void findAllStatiDropdownByFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findAllStatiDropdownByFiltro(filtroListaQuestionariTemplate.getCriterioRicerca(), filtroListaQuestionariTemplate.getStatoQuestionario())).thenReturn(new ArrayList<String>());
		questionarioTemplateSqlService.findAllStatiDropdownByFiltro(filtroListaQuestionariTemplate.getCriterioRicerca(), filtroListaQuestionariTemplate.getStatoQuestionario());
	}
	
	@Test
	public void findQuestionariTemplatePaginatiByIdProgrammaAndFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionariTemplateByIdProgrammaAndFiltro(
				1L, 
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.findQuestionariTemplatePaginatiByIdProgrammaAndFiltro(
				1L, 
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize());
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void findQuestionariTemplateByIdProgrammaAndFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionariTemplateByIdProgrammaAndFiltro(
				1L, 
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.findQuestionariTemplateByIdProgrammaAndFiltro(
				1L, 
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario());
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void findStatiDropdownByIdProgrammaAndFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findStatiDropdownByIdProgrammaAndFiltro(
				1L, 
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario())).thenReturn(new ArrayList<String>());
		questionarioTemplateSqlService.findStatiDropdownByIdProgrammaAndFiltro(
				1L, 
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario());
	}
	
	@Test
	public void getAllQuestionariTest() {
		when(this.templateQuestionarioSqlRepository.findAll()).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.getAllQuestionari();
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getQuestionariSCDTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionariSCD()).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.getQuestionariSCD();
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getQuestionariPerReferenteDelegatoGestoreProgrammaTest() {
		//test con policy programma = RFD
		programma.setPolicy(PolicyEnum.RFD);
		when(this.programmaService.getProgrammaById(1L)).thenReturn(programma);
		when(this.templateQuestionarioSqlRepository.findQuestionariRFD()).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.getQuestionariPerReferenteDelegatoGestoreProgramma(programma.getId());
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
		
		//test con policy programma = SCD
		programma.setPolicy(PolicyEnum.SCD);
		when(this.programmaService.getProgrammaById(1L)).thenReturn(programma);
		when(this.templateQuestionarioSqlRepository.findQuestionariSCD()).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato2 = questionarioTemplateSqlService.getQuestionariPerReferenteDelegatoGestoreProgramma(programma.getId());
		assertThat(risultato2.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionariTemplateByDefaultPolicySCDAndFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize());
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void findQuestionariTemplateByDefaultPolicySCDAndFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionariTemplateByDefaultPolicySCDAndFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.findQuestionariTemplateByDefaultPolicySCDAndFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario());
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void findStatiDropdownByDefaultPolicySCDAndFiltroTest() {
		when(this.templateQuestionarioSqlRepository.findStatiDropdownByDefaultPolicySCDAndFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario())).thenReturn(new ArrayList<String>());
		questionarioTemplateSqlService.findStatiDropdownByDefaultPolicySCDAndFiltro(
				filtroListaQuestionariTemplate.getCriterioRicerca(), 
				filtroListaQuestionariTemplate.getStatoQuestionario());
	}
	
	@Test
	public void cancellaQuestionarioTemplateTest() {
		doNothing().when(this.templateQuestionarioSqlRepository).deleteById(questionarioTemplateEntity.getId());
		questionarioTemplateSqlService.cancellaQuestionarioTemplate(questionarioTemplateEntity.getId());
	}
	
	@Test
	public void getQuestionarioTemplateDefaultRFDTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionarioTemplateDefaultRFD()).thenReturn(Optional.of(questionarioTemplateEntity));
		Optional<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.getQuestionarioTemplateDefaultRFD();
		assertThat(risultato.get().getId()).isEqualTo(questionarioTemplateEntity.getId());
	}
	
	@Test
	public void getQuestionarioTemplateDefaultSCDTest() {
		when(this.templateQuestionarioSqlRepository.findQuestionarioTemplateDefaultSCD()).thenReturn(Optional.of(questionarioTemplateEntity));
		Optional<QuestionarioTemplateEntity> risultato = questionarioTemplateSqlService.getQuestionarioTemplateDefaultSCD();
		assertThat(risultato.get().getId()).isEqualTo(questionarioTemplateEntity.getId());
	}
	
	@Test
	public void salvaQuestionarioTest() {
		when(this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity)).thenReturn(questionarioTemplateEntity);
		questionarioTemplateSqlService.salvaQuestionario(questionarioTemplateEntity);
	}
	
	@Test
	public void getQuestionarioTemplateByIdTest() {
		when(this.templateQuestionarioSqlRepository.findById(questionarioTemplateEntity.getId())).thenReturn(Optional.of(questionarioTemplateEntity));
		QuestionarioTemplateEntity risultato = questionarioTemplateSqlService.getQuestionarioTemplateById(questionarioTemplateEntity.getId());
		assertThat(risultato.getId()).isEqualTo(questionarioTemplateEntity.getId());
	}
	
	@Test
	public void getQuestionarioTemplateByIdKOTest() {
		//test KO per questionario non trovato
		when(this.templateQuestionarioSqlRepository.findById(questionarioTemplateEntity.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> questionarioTemplateSqlService.getQuestionarioTemplateById(questionarioTemplateEntity.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
}
