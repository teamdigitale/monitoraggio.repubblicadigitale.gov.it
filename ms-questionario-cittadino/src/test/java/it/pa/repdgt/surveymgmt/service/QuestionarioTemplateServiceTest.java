package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import it.pa.repdgt.surveymgmt.mapper.QuestionarioTemplateMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioTemplateRepository;
import it.pa.repdgt.surveymgmt.param.FiltroListaQuestionariTemplateParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;

@ExtendWith(MockitoExtension.class)
public class QuestionarioTemplateServiceTest {
	
	@Mock
	private QuestionarioTemplateMapper questionarioTemplateMapper;
	@Mock
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;
	@Mock
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private QuestionarioTemplateRepository questionarioTemplateRepository;
	@Mock
	private ProgrammaService programmaService;

	@Autowired
	@InjectMocks
	private QuestionarioTemplateService questionarioTemplateService;
	
	ProfilazioneParam profilazione;
	FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate;
	List<RuoloEntity> listaRuoli;
	RuoloEntity ruolo;
	QuestionarioTemplateEntity questionarioTemplateEntity;
	List<QuestionarioTemplateEntity> listaQuestionari;
	List<String> listaStati;
	
	@BeforeEach
	public void setUp() {
		profilazione = new ProfilazioneParam();
		profilazione.setCodiceFiscaleUtenteLoggato("CFUTENTE");
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD);
		profilazione.setIdProgetto(1L);
		profilazione.setIdProgramma(1L);
		filtroListaQuestionariTemplate = new FiltroListaQuestionariTemplateParam();
		filtroListaQuestionariTemplate.setCriterioRicerca("CRITERIORICERCA");
		filtroListaQuestionariTemplate.setCurrPage(0);
		filtroListaQuestionariTemplate.setPageSize(10);
		filtroListaQuestionariTemplate.setStatoQuestionario("ATTIVO");
		ruolo = new RuoloEntity();
		ruolo.setCodice("DTD");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		questionarioTemplateEntity = new QuestionarioTemplateEntity();
		questionarioTemplateEntity.setId("IDQUESTIONARIO");
		listaQuestionari = new ArrayList<>();
		listaQuestionari.add(questionarioTemplateEntity);
		listaStati = new ArrayList<>();
		listaStati.add("ATTIVO");
		listaStati.add("NON ATTIVO");
	}
	
	@Test
	public void getNumeroTotaleQuestionariTemplateByFiltroTest() {
		when(this.questionarioTemplateSqlService.getNumeroTotaleQuestionariTemplateByFiltro("CRITERIORICERCA", "ATTIVO")).thenReturn(1L);
		Long risultato = questionarioTemplateService.getNumeroTotaleQuestionariTemplateByFiltro("CRITERIORICERCA", "ATTIVO");
		assertThat(risultato).isEqualTo(1L);
	}
	
	@Test
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroDTDTest() {
		//test con ruoloUtenteLoggato = DTD
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		when(this.questionarioTemplateSqlService.findAllQuestionariTemplatePaginatiByFiltro(
								"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
								filtroListaQuestionariTemplate.getStatoQuestionario(),
								filtroListaQuestionariTemplate.getCurrPage(),
								filtroListaQuestionariTemplate.getPageSize()
							)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU
		ruolo.setCodice("DSCU");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		when(this.questionarioTemplateSqlService.findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
								"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
								filtroListaQuestionariTemplate.getStatoQuestionario(),
								filtroListaQuestionariTemplate.getCurrPage(),
								filtroListaQuestionariTemplate.getPageSize()
							)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroREGTest() {
		//test con ruoloUtenteLoggato = REG/DEG
		ruolo.setCodice("REG");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		when(this.questionarioTemplateSqlService.findQuestionariTemplatePaginatiByIdProgrammaAndFiltro(
								profilazione.getIdProgramma(),
								"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
								filtroListaQuestionariTemplate.getStatoQuestionario(),
								filtroListaQuestionariTemplate.getCurrPage(),
								filtroListaQuestionariTemplate.getPageSize()
							)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroConRuoliNonAutorizzatiTest() {
		//test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL 
		//ruoli che non devono visualizzare i questionari
		ruolo.setCodice("REGP");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(0);
	}
	
	@Test
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroKOTest() {
		//test KO per ruolo non definito per l'utente
		ruolo.setCodice("REGP");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		Assertions.assertThrows(QuestionarioTemplateException.class, () -> questionarioTemplateService.getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate));
		assertThatExceptionOfType(QuestionarioTemplateException.class);
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneDTDTest() {
		//test con ruoloUtenteLoggato = DTD 
		when(this.questionarioTemplateSqlService.findAllQuestionariTemplatePaginatiByFiltro(
				"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU 
		ruolo.setCodice("DSCU");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU);
		when(this.questionarioTemplateSqlService.findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
				"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
				filtroListaQuestionariTemplate.getStatoQuestionario(),
				filtroListaQuestionariTemplate.getCurrPage(),
				filtroListaQuestionariTemplate.getPageSize()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneREGTest() {
		//test con ruoloUtenteLoggato = REG/DEG
		ruolo.setCodice("REG");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG);
		when(this.questionarioTemplateSqlService.findQuestionariTemplatePaginatiByIdProgrammaAndFiltro(
								profilazione.getIdProgramma(),
								"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
								filtroListaQuestionariTemplate.getStatoQuestionario(),
								filtroListaQuestionariTemplate.getCurrPage(),
								filtroListaQuestionariTemplate.getPageSize()
							)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneConRuoliNonAutorizzatiTest() {
		//test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL 
		//ruoli che non devono visualizzare i questionari
		ruolo.setCodice("REGP");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(0);
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneDTDTest() {
		//test con ruoloUtenteLoggato = DTD 
		when(this.questionarioTemplateSqlService.findAllQuestionariTemplateByFiltro(
				"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
				filtroListaQuestionariTemplate.getStatoQuestionario()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU 
		ruolo.setCodice("DSCU");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU);
		when(this.questionarioTemplateSqlService.findQuestionariTemplateByDefaultPolicySCDAndFiltro(
				"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
				filtroListaQuestionariTemplate.getStatoQuestionario()
			)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneREGTest() {
		//test con ruoloUtenteLoggato = REG/DEG
		ruolo.setCodice("REG");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG);
		when(this.questionarioTemplateSqlService.findQuestionariTemplateByIdProgrammaAndFiltro(
								profilazione.getIdProgramma(),
								"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
								filtroListaQuestionariTemplate.getStatoQuestionario()
							)).thenReturn(listaQuestionari);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	}
	
	@Test
	public void getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneConRuoliNonAutorizzatiTest() {
		//test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL 
		//ruoli che non devono visualizzare i questionari
		ruolo.setCodice("REGP");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP);
		List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(0);
	}
	
	@Test
	public void getAllStatiDropdownByProfilazioneAndFiltroDTDTest() {
		//test con ruoloUtenteLoggato = DTD
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		when(this.questionarioTemplateSqlService.findAllStatiDropdownByFiltro(
						"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
						filtroListaQuestionariTemplate.getStatoQuestionario()
					)).thenReturn(listaStati);
		List<String> risultato = questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaStati.size());
	}
	
	@Test
	public void getAllStatiDropdownByProfilazioneAndFiltroDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU
		ruolo.setCodice("DSCU");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		when(this.questionarioTemplateSqlService.findStatiDropdownByDefaultPolicySCDAndFiltro(
						"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
						filtroListaQuestionariTemplate.getStatoQuestionario()
					)).thenReturn(listaStati);
		List<String> risultato = questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaStati.size());
	}
	
	@Test
	public void getAllStatiDropdownByProfilazioneAndFiltroREGTest() {
		//test con ruoloUtenteLoggato = REG/DEG
		ruolo.setCodice("REG");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		when(this.questionarioTemplateSqlService.findStatiDropdownByIdProgrammaAndFiltro(
						profilazione.getIdProgramma(),
						"%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
						filtroListaQuestionariTemplate.getStatoQuestionario()
					)).thenReturn(listaStati);
		List<String> risultato = questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(listaStati.size());
	}
	
	@Test
	public void getAllStatiDropdownByProfilazioneAndFiltroConRuoliNonAutorizzatiTest() {
		//test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL 
		//ruoli che non devono visualizzare i questionari
		ruolo.setCodice("REGP");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		List<String> risultato = questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate);
		assertThat(risultato.size()).isEqualTo(0);
	}
	
	@Test
	public void getAllStatiDropdownByProfilazioneAndFiltroKOTest() {
		//test KO per ruolo non definito per l'utente
		ruolo.setCodice("REG");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		when(this.ruoloService.getRuoliByCodiceFiscale(profilazione.getCodiceFiscaleUtenteLoggato())).thenReturn(listaRuoli);
		Assertions.assertThrows(QuestionarioTemplateException.class, () -> questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(profilazione, filtroListaQuestionariTemplate));
		assertThatExceptionOfType(QuestionarioTemplateException.class);
	}
}
