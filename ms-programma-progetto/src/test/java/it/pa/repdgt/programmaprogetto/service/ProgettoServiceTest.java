package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.programmaprogetto.bean.DettaglioEntiPartnerBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioProgettoBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioProgrammaLightBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioSediBean;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.exception.ProgettoException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.mapper.ProgettoMapper;
import it.pa.repdgt.programmaprogetto.mapper.ProgrammaMapper;
import it.pa.repdgt.programmaprogetto.repository.EnteRepository;
import it.pa.repdgt.programmaprogetto.repository.EnteSedeProgettoRepository;
import it.pa.repdgt.programmaprogetto.repository.ProgettoRepository;
import it.pa.repdgt.programmaprogetto.repository.ProgrammaRepository;
import it.pa.repdgt.programmaprogetto.repository.QuestionarioTemplateSqlRepository;
import it.pa.repdgt.programmaprogetto.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.programmaprogetto.repository.ReferentiDelegatiEntePartnerRepository;
import it.pa.repdgt.programmaprogetto.repository.RuoloRepository;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettoRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.resource.PaginaProgetti;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.StoricoEnteException;
import it.pa.repdgt.shared.repository.storico.StoricoEnteGestoreProgettoRepository;
import it.pa.repdgt.shared.repository.storico.StoricoEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.service.storico.StoricoService;

//@ExtendWith(MockitoExtension.class)
public class ProgettoServiceTest {
	@Mock
	private ProgrammaRepository programmaRepository;
	@Mock
	private ProgettoRepository progettoRepository;
	@Mock
	private EnteRepository enteRepository;
	@Mock
	private QuestionarioTemplateSqlRepository questionarioTemplateSqlRepository;
	@Mock
	private RuoloRepository ruoloRepository;
	@Mock
	private StoricoEnteGestoreProgrammaRepository storicoEnteGestoreProgrammaRepository;
	@Mock
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	@Mock
	private ReferentiDelegatiEntePartnerRepository referentiDelegatiEntePartnerRepository;
	@Mock
	private EnteSedeProgettoRepository enteSedeProgettoRepository;
	@Mock
	private StoricoEnteGestoreProgettoRepository storicoEnteGestoreProgettoRepository;
	@Mock
	private EnteSedeProgettoService enteSedeProgettoService;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private ProgrammaService programmaService;
	@Mock
	private EmailService emailService;
	@Mock
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Mock
	private EnteService enteService;
	@Mock
	private StoricoService storicoService;
	@Mock
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;
	@Mock
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	@Mock
	private ReferentiDelegatiEnteGestoreProgrammaService referentiDelegatiEnteGestoreProgrammaService;
	@Mock
	private EntePartnerService entePartnerService;
	@Mock
	private SedeService sedeService;
	@Mock
	private UtenteService utenteService;
	@Mock
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;
	@Mock
	private ReferentiDelegatiEntePartnerService referentiDelegatiEntePartnerService;
	@Mock
	private ProgrammaMapper programmaMapper;
	@Mock
	private ProgettoMapper progettoMapper;
	@Mock
	private List<ProgrammaEntity> listaProgrammi;
	@Mock
	private List<ProgettoEntity> listaProgetti;
	@Mock
	private List<QuestionarioTemplateEntity> listaQuestionari;
	@Mock
	private List<String> listaStati;
	@Mock
	private Set<String> setStati;
	@Mock
	private List<String> listaPolicies;
	@Mock
	private Set<String> setPolicies;

	@Autowired
	@InjectMocks
	private ProgettoService progettoService;

	ProgrammaEntity programma1;
	ProgrammaEntity programma2;
	EnteEntity ente1;
	Optional<ProgrammaEntity> programmaOptional;
	Optional<ProgettoEntity> progettoOptional;
	Optional<EnteEntity> enteOptional;
	Optional<String> stato;
	Optional<String> policy;
	FiltroRequest filtro;
	ProgettoFiltroRequest progettoFiltro;
	ProgrammiParam progParam;
	ProgettiParam progettiParam;
	PaginaProgetti pagina;
	List<String> listaRuoli;
	int currPage;
	int pageSize;
	ProgettoEntity progetto1;
	QuestionarioTemplateEntity questionario1;
	SedeEntity sede;
	List<SedeEntity> listaSedi;

	@BeforeEach
	public void setUp() {
		programma1 = new ProgrammaEntity();
		programma1.setNome("programma1");
		programma1.setId(1L);
		programma1.setStato("ATTIVO");
		programma1.setPolicy(PolicyEnum.RFD);
		programma2 = new ProgrammaEntity();
		programma2.setNome("programma2");
		programma2.setId(2L);
		programma2.setStato("ATTIVO");
		programma2.setPolicy(PolicyEnum.SCD);
		ente1 = new EnteEntity();
		ente1.setId(1L);
		ente1.setNome("ente1");
		programma1.setEnteGestoreProgramma(ente1);
		listaProgrammi = new ArrayList<>();
		listaProgrammi.add(programma1);
		listaProgrammi.add(programma2);
		filtro = new FiltroRequest();
		filtro.setCriterioRicerca("programma1");
		filtro.setPolicies(null);
		filtro.setStati(null);
		progettoFiltro = new ProgettoFiltroRequest();
		progettoFiltro.setCriterioRicerca("programma1");
		progettoFiltro.setPolicies(null);
		progettoFiltro.setStati(null);
		List<String> idsProgrammi = new ArrayList<>();
		idsProgrammi.add("1");
		idsProgrammi.add("2");
		progettoFiltro.setIdsProgrammi(idsProgrammi);
		progParam = new ProgrammiParam();
		progParam.setCfUtenteLoggato("UIHPLW87R49F205X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(filtro);
		progParam.setIdProgramma(1L);
		progettiParam = new ProgettiParam();
		progettiParam.setCfUtenteLoggato("UIHPLW87R49F205X");
		progettiParam.setCodiceRuoloUtenteLoggato("DTD");
		progettiParam.setFiltroRequest(progettoFiltro);
		progettiParam.setIdProgramma(1L);
		progettiParam.setIdProgetto(1L);
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setNome("progetto 1");
		progetto1.setStato("ATTIVO");
		progetto1.setProgramma(programma1);
		progetto1.setCup("432789122");
		listaProgetti = new ArrayList<>();
		listaProgetti.add(progetto1);
		pagina = new PaginaProgetti();
		pagina.setPaginaProgetti(listaProgetti);
		pagina.setTotalElements(1);
		pagina.setTotalPages(1);
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DTD");
		currPage = 0;
		pageSize = 10;
		listaStati = new ArrayList<>();
		listaStati.add("ATTIVO");
		listaStati.add("NON ATTIVO");
		setStati = new HashSet<>();
		setStati.add("ATTIVO");
		setStati.add("NON ATTIVO");
		programmaOptional = Optional.of(programma1);
		progettoOptional = Optional.of(progetto1);
		enteOptional = Optional.of(ente1);
		stato = Optional.of(programma1.getStato());
		listaPolicies = new ArrayList<>();
		listaPolicies.add("RDF");
		listaPolicies.add("SCD");
		setPolicies = new HashSet<>();
		setPolicies.add("RDF");
		setPolicies.add("SCD");
		policy = Optional.of(programma1.getPolicy().getValue());
		questionario1 = new QuestionarioTemplateEntity();
		questionario1.setId("1");
		questionario1.setNome("questionario 1");
		questionario1.setStato("NON ATTIVO");
		listaQuestionari = new ArrayList<>();
		listaQuestionari.add(questionario1);
		sede = new SedeEntity();
		sede.setId(1L);
		sede.setNome("sede1");
		listaSedi = new ArrayList<>();
		listaSedi.add(sede);
	}

	// test getAllProgettiPaginati per utenti DTD
	// @Test
	public void getAllProgettiPaginatiDTDTest() {
		when(progettoRepository.findAllPaginati(
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati(),
				0,
				10)).thenReturn(listaProgetti);
		when(progettoRepository.countAll(
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati())).thenReturn(1L);
		PaginaProgetti paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize,
				progettoFiltro);
		assertThat(paginaProgetti.getPaginaProgetti().size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
	}

	// test getAllProgettiPaginati per utenti DSCU
	// @Test
	public void getAllProgettiPaginatiDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuoloUtenteLoggato("DSCU");
		when(progettoRepository.findByPolicyPaginati(
				PolicyEnum.SCD.toString(),
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati(),
				currPage * pageSize,
				pageSize)).thenReturn(listaProgetti);
		when(progettoRepository.countByPolicy(
				PolicyEnum.SCD.toString(),
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati())).thenReturn(1L);
		PaginaProgetti paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize,
				progettoFiltro);
		assertThat(paginaProgetti.getPaginaProgetti().size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
	}

	// test getAllProgettiPaginati per utenti con ruoli: REG - DEG
	// @Test
	public void getAllProgettiPaginatiREGTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuoloUtenteLoggato("REG");
		when(progettoRepository.findProgettiPerReferenteDelegatoGestoreProgrammaPaginati(
				progettiParam.getIdProgramma(),
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati(),
				currPage * pageSize,
				pageSize)).thenReturn(listaProgetti);
		when(this.progettoRepository.countProgettiPerReferenteDelegatoGestoreProgramma(
				progettiParam.getIdProgramma(),
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati())).thenReturn(1L);
		PaginaProgetti paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize,
				progettoFiltro);
		assertThat(paginaProgetti.getPaginaProgetti().size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
	}

	// test getAllProgettiPaginati per utenti con ruoli: REGP - DEGP
	// @Test
	public void getAllProgettiPaginatiREGPTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuoloUtenteLoggato("REGP");
		when(progettoRepository.findById(progettiParam.getIdProgetto())).thenReturn(progettoOptional);
		PaginaProgetti paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize,
				progettoFiltro);
		assertThat(paginaProgetti.getPaginaProgetti().get(0).getId()).isEqualTo(progetto1.getId());
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
	}

	// test getAllProgettiPaginati per utenti con ruoli non predefiniti
	// @Test
	public void getAllProgettiPaginatiRuoloNonPredefinitoTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(progettoRepository.findAllPaginati(
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati(),
				0,
				10)).thenReturn(listaProgetti);
		when(progettoRepository.countAll(
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati())).thenReturn(1L);
		PaginaProgetti paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize,
				progettoFiltro);
		assertThat(paginaProgetti.getPaginaProgetti().size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
	}

	// @Test
	public void getAllProgettiPaginatiKOTest() {
		// Test KO per pagina non trovata
		when(progettoRepository.findAllPaginati(
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati(),
				110,
				10)).thenReturn(listaProgetti);
		when(progettoRepository.countAll(
				progettiParam.getFiltroRequest().getCriterioRicerca(),
				"%" + progettiParam.getFiltroRequest().getCriterioRicerca() + "%",
				progettiParam.getFiltroRequest().getPolicies(),
				progettiParam.getFiltroRequest().getIdsProgrammi(),
				progettiParam.getFiltroRequest().getStati())).thenReturn(1L);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.getAllProgettiPaginati(progettiParam, 11, pageSize, progettoFiltro));
		assertThatExceptionOfType(ProgettoException.class);

		// Test KO per progetto non trovato
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuoloUtenteLoggato("REGP");
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}

	// test getAllProgrammiDropdown
	// @Test
	public void getAllProgrammiDropdownPerProgettiTest() {
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);
		when(programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro))
				.thenReturn(programmiLightDropdown);
		progettoService.getAllProgrammiDropdownPerProgetti(progettiParam);
		assertThat(programmiLightDropdown.size()).isEqualTo(1);
		verify(programmaService, times(1)).getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
	}

	// test getAllPoliciesDropdown
	// @Test
	public void getAllPoliciesDropdownPerProgettiTest() {
		when(programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro))
				.thenReturn(listaPolicies);
		progettoService.getAllPoliciesDropdownPerProgetti(progettiParam);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaService, times(1)).getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
	}

	// test getAllStatiDropdown per utenti DTD
	// @Test
	public void getAllStatiDropdownDTDTest() {
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				progettiParam.getCfUtenteLoggato(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(),
				progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findAllStati(progettoFiltro.getCriterioRicerca(),
				"%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),
				progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}

	// test getAllStatiDropdown per utenti DSCU
	// @Test
	public void getAllStatiDropdownDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuoloUtenteLoggato("DSCU");
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				progettiParam.getCfUtenteLoggato(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(),
				progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findStatiByPolicy(PolicyEnum.SCD.toString(),
				progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%",
				progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}

	// test getAllStatiDropdown per utenti con ruoli: REG - DEG
	// @Test
	public void getAllStatiDropdownREGTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuoloUtenteLoggato("REG");
		when(progettoService.getStatiPerReferenteDelegatoGestoreProgramma(progettiParam.getIdProgramma(),
				progettoFiltro)).thenReturn(listaStati);
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				progettiParam.getCfUtenteLoggato(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(),
				progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findStatiPerReferenteDelegatoGestoreProgramma(
				progettiParam.getIdProgramma(), progettoFiltro.getCriterioRicerca(),
				"%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),
				progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}

	// test getAllStatiDropdown per utenti con ruoli: REGP - DEGP
	// @Test
	public void getAllStatiDropdownREGPTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuoloUtenteLoggato("REGP");
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(progettoOptional.get().getNome()).isEqualTo(progetto1.getNome());
		verify(progettoRepository, times(1)).findById(progettiParam.getIdProgramma());
	}

	// test getAllStatiDropdown per utenti con ruoli: REPP - DEPP
	// @Test
	public void getAllStatiDropdownREPPTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REPP");
		progettiParam.setCodiceRuoloUtenteLoggato("REPP");
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(progettoOptional.get().getNome()).isEqualTo(progetto1.getNome());
		verify(progettoRepository, times(1)).findById(progettiParam.getIdProgramma());
	}

	// test getAllProgettiPaginati per utenti con ruolo non predefinito
	// @Test
	public void getAllStatiDropdownRuoloNonPredefinitoTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				progettiParam.getCfUtenteLoggato(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(),
				progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findAllStati(progettoFiltro.getCriterioRicerca(),
				"%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),
				progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}

	// @Test
	public void getAllStatiDropdownKOTest() {
		// test KO per progetto non trovato
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuoloUtenteLoggato("REGP");
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> progettoService.getAllStatiDropdown(progettiParam, progettoFiltro));
		assertThatExceptionOfType(ResourceNotFoundException.class);
		verify(progettoRepository, times(1)).findById(progettiParam.getIdProgramma());
	}

	// @Test
	public void getSchedaProgettoByIdTest() {
		DettaglioProgrammaLightBean dettaglioProgramma = new DettaglioProgrammaLightBean();
		DettaglioProgettoBean dettaglioProgetto = new DettaglioProgettoBean();
		List<Long> idsEntiPartner = new ArrayList<>();
		idsEntiPartner.add(ente1.getId());
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
		when(progettoMapper.toDettaglioProgrammaLightBeanFrom(programma1)).thenReturn(dettaglioProgramma);
		when(progettoMapper.toDettaglioProgettoBeanFrom(progetto1)).thenReturn(dettaglioProgetto);
		when(entePartnerService.getIdEntiPartnerByProgetto(progettiParam.getIdProgetto())).thenReturn(idsEntiPartner);
		when(enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		List<DettaglioEntiPartnerBean> listaEntiPartner = idsEntiPartner
				.stream()
				.map(idEnte -> {
					EnteEntity enteFetchDB = this.enteService.getEnteById(idEnte);
					DettaglioEntiPartnerBean dettaglioEntePartner = new DettaglioEntiPartnerBean();
					dettaglioEntePartner.setId(idEnte);
					dettaglioEntePartner.setNome(enteFetchDB.getNome());
					dettaglioEntePartner.setReferenti(this.entePartnerService
							.getReferentiEntePartnerProgetto(progettiParam.getIdProgetto(), idEnte));
					dettaglioEntePartner.setStato(
							this.entePartnerService.getStatoEntePartner(progettiParam.getIdProgetto(), idEnte));
					return dettaglioEntePartner;
				})
				.collect(Collectors.toList());
		when(sedeService.getSediByIdProgetto(progettiParam.getIdProgetto())).thenReturn(listaSedi);
		Map<SedeEntity, List<Long>> mappaSediProgettoEnte = new HashMap<>();
		when(enteService.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sede.getId()))
				.thenReturn(idsEntiPartner);
		listaSedi.forEach(sedeProgetto -> {
			mappaSediProgettoEnte.put(sedeProgetto, this.enteService
					.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sedeProgetto.getId()));
		});

		List<DettaglioSediBean> listaDettaglioSedi = new ArrayList<>();
		mappaSediProgettoEnte.keySet()
				.stream()
				.forEach(sede -> {
					List<Long> listaIdEnti = mappaSediProgettoEnte.get(sede);
					List<DettaglioSediBean> listaDettaglioSediParziale = listaIdEnti
							.stream()
							.map(idEnte -> {
								DettaglioSediBean dettaglioSede = new DettaglioSediBean();
								dettaglioSede.setId(sede.getId());
								dettaglioSede.setNome(sede.getNome());
								dettaglioSede.setRuoloEnte(this.enteService.getRuoloEnteByIdProgettoAndIdSedeAndIdEnte(
										progettiParam.getIdProgetto(), sede.getId(), idEnte));
								dettaglioSede.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(
										progettiParam.getIdProgetto(), sede.getId(), idEnte));
								dettaglioSede.setServiziErogati(sede.getServiziErogati());
								dettaglioSede.setEnteDiRiferimento(this.enteService.getEnteById(idEnte).getNome());
								dettaglioSede.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(
										progettiParam.getIdProgetto(), sede.getId(), idEnte));
								return dettaglioSede;
							})
							.collect(Collectors.toList());
					listaDettaglioSedi.addAll(listaDettaglioSediParziale);
				});

		dettaglioProgetto = progettoMapper.toDettaglioProgettoBeanFrom(progetto1);
		SchedaProgettoBean schedaProgetto = new SchedaProgettoBean();
		schedaProgetto.setDettaglioProgetto(dettaglioProgetto);
		schedaProgetto.setEntiPartner(listaEntiPartner);
		schedaProgetto.setSedi(listaDettaglioSedi);
		progetto1.setEnteGestoreProgetto(ente1);

		SchedaProgettoBean schedaProgettoMock = progettoService.getSchedaProgettoById(progettiParam.getIdProgetto());
		assertThat(schedaProgettoMock.getEntiPartner().size()).isEqualTo(schedaProgetto.getEntiPartner().size());
		assertThat(schedaProgettoMock.getSedi().size()).isEqualTo(schedaProgetto.getSedi().size());
	}

	// test con ente gestore programma del programma1 a null
	// @Test
	public void getSchedaProgettoByIdTest2() {
		DettaglioProgrammaLightBean dettaglioProgramma = new DettaglioProgrammaLightBean();
		DettaglioProgettoBean dettaglioProgetto = new DettaglioProgettoBean();
		List<Long> idsEntiPartner = new ArrayList<>();
		idsEntiPartner.add(ente1.getId());
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
		when(progettoMapper.toDettaglioProgrammaLightBeanFrom(programma1)).thenReturn(dettaglioProgramma);
		when(progettoMapper.toDettaglioProgettoBeanFrom(progetto1)).thenReturn(dettaglioProgetto);
		when(entePartnerService.getIdEntiPartnerByProgetto(progettiParam.getIdProgetto())).thenReturn(idsEntiPartner);
		when(enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		List<DettaglioEntiPartnerBean> listaEntiPartner = idsEntiPartner
				.stream()
				.map(idEnte -> {
					EnteEntity enteFetchDB = this.enteService.getEnteById(idEnte);
					DettaglioEntiPartnerBean dettaglioEntePartner = new DettaglioEntiPartnerBean();
					dettaglioEntePartner.setId(idEnte);
					dettaglioEntePartner.setNome(enteFetchDB.getNome());
					dettaglioEntePartner.setReferenti(this.entePartnerService
							.getReferentiEntePartnerProgetto(progettiParam.getIdProgetto(), idEnte));
					dettaglioEntePartner.setStato(
							this.entePartnerService.getStatoEntePartner(progettiParam.getIdProgetto(), idEnte));
					return dettaglioEntePartner;
				})
				.collect(Collectors.toList());
		when(sedeService.getSediByIdProgetto(progettiParam.getIdProgetto())).thenReturn(listaSedi);
		Map<SedeEntity, List<Long>> mappaSediProgettoEnte = new HashMap<>();
		when(enteService.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sede.getId()))
				.thenReturn(idsEntiPartner);
		listaSedi.forEach(sedeProgetto -> {
			mappaSediProgettoEnte.put(sedeProgetto, this.enteService
					.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sedeProgetto.getId()));
		});

		List<DettaglioSediBean> listaDettaglioSedi = new ArrayList<>();
		mappaSediProgettoEnte.keySet()
				.stream()
				.forEach(sede -> {
					List<Long> listaIdEnti = mappaSediProgettoEnte.get(sede);
					List<DettaglioSediBean> listaDettaglioSediParziale = listaIdEnti
							.stream()
							.map(idEnte -> {
								DettaglioSediBean dettaglioSede = new DettaglioSediBean();
								dettaglioSede.setId(sede.getId());
								dettaglioSede.setNome(sede.getNome());
								dettaglioSede.setRuoloEnte(this.enteService.getRuoloEnteByIdProgettoAndIdSedeAndIdEnte(
										progettiParam.getIdProgetto(), sede.getId(), idEnte));
								dettaglioSede.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(
										progettiParam.getIdProgetto(), sede.getId(), idEnte));
								dettaglioSede.setServiziErogati(sede.getServiziErogati());
								dettaglioSede.setEnteDiRiferimento(this.enteService.getEnteById(idEnte).getNome());
								dettaglioSede.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(
										progettiParam.getIdProgetto(), sede.getId(), idEnte));
								return dettaglioSede;
							})
							.collect(Collectors.toList());
					listaDettaglioSedi.addAll(listaDettaglioSediParziale);
				});

		dettaglioProgetto = progettoMapper.toDettaglioProgettoBeanFrom(progetto1);
		SchedaProgettoBean schedaProgetto = new SchedaProgettoBean();
		schedaProgetto.setDettaglioProgetto(dettaglioProgetto);
		schedaProgetto.setEntiPartner(listaEntiPartner);
		schedaProgetto.setSedi(listaDettaglioSedi);
		progetto1.setEnteGestoreProgetto(null);

		SchedaProgettoBean schedaProgettoMock = progettoService.getSchedaProgettoById(progettiParam.getIdProgetto());
		assertThat(schedaProgettoMock.getEntiPartner().size()).isEqualTo(schedaProgetto.getEntiPartner().size());
		assertThat(schedaProgettoMock.getSedi().size()).isEqualTo(schedaProgetto.getSedi().size());
	}

	// @Test
	public void creaNuovoProgettoTest() {
		progetto1.setDataInizioProgetto(new Date());
		progetto1.setDataFineProgetto(new Date());
		when(progettoService.salvaProgetto(progetto1)).thenReturn(progetto1);
		ProgettoEntity progettocreato = progettoService.creaNuovoProgetto(progetto1);
		assertThat(progettocreato.getId()).isEqualTo(progetto1.getId());
		verify(progettoRepository, times(1)).save(progetto1);
	}

	@SuppressWarnings("deprecation")
	// @Test
	public void creaNuovoProgettoKOTest() {
		// test KO per data fine antecedente quella di inizio
		Date dataInizio = new Date();
		dataInizio.setDate(13);
		Date dataFine = new Date();
		dataFine.setDate(10);
		progetto1.setDataInizioProgetto(dataInizio);
		progetto1.setDataFineProgetto(dataFine);
		Assertions.assertThrows(ProgettoException.class, () -> progettoService.creaNuovoProgetto(progetto1));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);
	}

	// @Test
	public void aggiornaProgettoTest() {
		ProgettoRequest progettoRequest = new ProgettoRequest();
		when(progettoRepository.existsById(progetto1.getId())).thenReturn(true);
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(progettoMapper.toEntityFrom(progettoRequest, progetto1)).thenReturn(progetto1);
		progettoService.aggiornaProgetto(progettoRequest, progetto1.getId());
		verify(progettoRepository, times(1)).save(progetto1);
	}

	// @Test
	public void aggiornaProgettoKOTest() {
		// test KO per progetto non presente
		when(progettoRepository.existsById(progetto1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.aggiornaProgetto(new ProgettoRequest(), progetto1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);

		// test KO per stato progetto = TERMINATO (progetto non modificabile)
		progetto1.setStato("TERMINATO");
		when(progettoRepository.existsById(progetto1.getId())).thenReturn(true);
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.aggiornaProgetto(new ProgettoRequest(), progetto1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);
	}

	// @Test
	public void assegnaEnteGestoreProgettoTest() {
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		progettoService.assegnaEnteGestoreProgetto(progetto1.getId(), ente1.getId());
		assertThat(progetto1.getEnteGestoreProgetto().getNome()).isEqualTo(ente1.getNome());
		assertThat(progetto1.getStatoGestoreProgetto()).isEqualTo("NON ATTIVO");
		verify(progettoRepository, times(1)).save(progetto1);
	}

	// @Test
	public void assegnaEnteGestoreProgettoKOTest() {
		// test KO per progetto non presente
		when(progettoRepository.findById(progetto1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.assegnaEnteGestoreProgetto(progetto1.getId(), ente1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);

		// test KO per ente non trovato
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(enteService.getEnteById(ente1.getId())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.assegnaEnteGestoreProgetto(progetto1.getId(), ente1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);
	}

	// @Test
	public void assegnaProgrammaAlProgettoTest() {
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(programmaService.getProgrammaById(programma1.getId())).thenReturn(programma1);
		progettoService.assegnaProgrammaAlProgetto(progetto1.getId(), programma1.getId());
		assertThat(progetto1.getProgramma().getNome()).isEqualTo(programma1.getNome());
		verify(progettoRepository, times(1)).save(progetto1);
	}

	// @Test
	public void assegnaProgrammaAlProgettoKOTest() {
		// test KO per progetto non presente
		when(progettoRepository.findById(progetto1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.assegnaProgrammaAlProgetto(progetto1.getId(), programma1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);

		// test KO per programma non presente
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(programmaService.getProgrammaById(programma1.getId())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.assegnaProgrammaAlProgetto(progetto1.getId(), programma1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);
	}

	// @Test
	public void cancellazioneProgettoTest() {
		progetto1.setStato("NON ATTIVO");
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegatiGestoreTest = new ArrayList<>();
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiDelegatiPartnerTest = new ArrayList<>();
		List<EnteSedeProgetto> enteSedeProgettoTest = new ArrayList<>();
		when(progettoRepository.existsById(progetto1.getId())).thenReturn(true);
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(referentiDelegatiEnteGestoreProgettoRepository
				.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId()))
				.thenReturn(referentiDelegatiGestoreTest);
		when(referentiDelegatiEntePartnerRepository
				.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId()))
				.thenReturn(referentiDelegatiPartnerTest);
		when(enteSedeProgettoRepository.getEnteSedeProgettoByIdProgetto(progetto1.getId()))
				.thenReturn(enteSedeProgettoTest);
		doAnswer(invocation -> {
			List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegati = this.referentiDelegatiEnteGestoreProgettoRepository
					.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId());
			return referentiDelegati;
		}).when(referentiDelegatiEnteGestoreProgettoService).cancellaReferentiDelegatiProgetto(progetto1.getId());
		doAnswer(invocation -> {
			List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiDelegati = this.referentiDelegatiEntePartnerRepository
					.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId());
			return referentiDelegati;
		}).when(referentiDelegatiEntePartnerService).cancellaReferentiDelegatiPartner(progetto1.getId());
		doAnswer(invocation -> {
			List<EnteSedeProgetto> enteSedeProgetto = this.enteSedeProgettoRepository
					.getEnteSedeProgettoByIdProgetto(progetto1.getId());
			return enteSedeProgetto;
		}).when(enteSedeProgettoService).cancellaEnteSedeProgetto(progetto1.getId());
		progettoService.cancellazioneProgetto(progetto1.getId());
		verify(progettoRepository, times(1)).delete(progetto1);
	}

	// @Test
	public void cancellazioneProgettoKOTest() {
		// test KO per progetto non presente
		when(progettoRepository.existsById(progetto1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.cancellazioneProgetto(progetto1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).delete(progetto1);

		// test KO per progetto non cancellabile
		when(progettoRepository.existsById(progetto1.getId())).thenReturn(true);
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.cancellazioneProgetto(progetto1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).delete(progetto1);
	}

	// @Test
	public void terminaProgettoTest() throws Exception {
		// test per progretto con statoGestoreProgetto == "ATTIVO"
		progetto1.setStatoGestoreProgetto(StatoEnum.ATTIVO.getValue());
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		progetto1.setEnteGestoreProgetto(ente1);
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegati = new ArrayList<>();
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(referentiDelegatiEnteGestoreProgettoService.getReferentiEDelegatiProgetto(progetto1.getId()))
				.thenReturn(referentiDelegati);
		doNothing().when(storicoService).storicizzaEnteGestoreProgetto(progetto1, StatoEnum.TERMINATO.getValue());
		doNothing().when(enteService).terminaEntiPartner(progetto1.getId());
		doNothing().when(enteSedeProgettoService).cancellaOTerminaEnteSedeProgetto(progetto1.getId());
		progettoService.terminaProgetto(progetto1.getId(), currentDate);
		assertThat(progetto1.getStatoGestoreProgetto()).isEqualTo("TERMINATO");
		verify(progettoRepository, times(1)).save(progetto1);
	}

	// @Test
	public void terminaProgettoTest2() throws Exception {
		// test per progretto con statoGestoreProgetto == "NON ATTIVO"
		progetto1.setStatoGestoreProgetto(StatoEnum.NON_ATTIVO.getValue());
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		progetto1.setEnteGestoreProgetto(ente1);
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegati = new ArrayList<>();
		progetto1.setEnteGestoreProgetto(ente1);
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(referentiDelegatiEnteGestoreProgettoService.getReferentiEDelegatiProgetto(progetto1.getId()))
				.thenReturn(referentiDelegati);
		doNothing().when(enteService).terminaEntiPartner(progetto1.getId());
		doNothing().when(enteSedeProgettoService).cancellaOTerminaEnteSedeProgetto(progetto1.getId());
		progettoService.terminaProgetto(progetto1.getId(), currentDate);
		assertThat(progetto1.getStatoGestoreProgetto()).isEqualTo(null);
		verify(progettoRepository, times(1)).save(progetto1);
	}

	// @Test
	public void terminaProgettoKOTest() throws Exception {
		// test KO per data terminazione nel futuro
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.terminaProgetto(progetto1.getId(), new Date()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);

		// test KO per progetto non presente
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		when(progettoRepository.findById(progetto1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> progettoService.terminaProgetto(progetto1.getId(), currentDate));
		assertThatExceptionOfType(ResourceNotFoundException.class);
		verify(progettoRepository, times(0)).save(progetto1);

		// test KO per progetto non terminabile
		progetto1.setStato("NON ATTIVO");
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.terminaProgetto(progetto1.getId(), currentDate));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);
	}

	// @Test
	public void terminaProgettoKOTest2() throws Exception {
		// test KO impossibile storicizzare ente
		progetto1.setStatoGestoreProgetto(StatoEnum.ATTIVO.getValue());
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		doThrow(StoricoEnteException.class).when(storicoService).storicizzaEnteGestoreProgetto(progetto1,
				StatoEnum.TERMINATO.getValue());
		Assertions.assertThrows(ProgettoException.class,
				() -> progettoService.terminaProgetto(progetto1.getId(), currentDate));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);
	}

	// @Test
	public void getProgettiByIdProgramma() {
		when(progettoRepository.findProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		progettoService.getProgettiByIdProgramma(programma1.getId());
		verify(progettoRepository, times(1)).findProgettiByIdProgramma(programma1.getId());
	}

	// @Test
	public void attivaProgettoTest() {
		progetto1.setStato("ATTIVABILE");
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		progettoService.attivaProgetto(progetto1.getId());
		assertThat(progetto1.getStato()).isEqualTo("ATTIVO");
		verify(progettoRepository, times(1)).save(progetto1);
	}

	// @Test
	public void cancellaOTerminaProgettoTest() throws Exception {
		// test con progetto a NON ATTIVO
		progetto1.setStato("NON ATTIVO");
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegatiGestoreTest = new ArrayList<>();
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiDelegatiPartnerTest = new ArrayList<>();
		List<EnteSedeProgetto> enteSedeProgettoTest = new ArrayList<>();
		when(progettoRepository.existsById(progetto1.getId())).thenReturn(true);
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(referentiDelegatiEnteGestoreProgettoRepository
				.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId()))
				.thenReturn(referentiDelegatiGestoreTest);
		when(referentiDelegatiEntePartnerRepository
				.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId()))
				.thenReturn(referentiDelegatiPartnerTest);
		when(enteSedeProgettoRepository.getEnteSedeProgettoByIdProgetto(progetto1.getId()))
				.thenReturn(enteSedeProgettoTest);
		doAnswer(invocation -> {
			List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegati = this.referentiDelegatiEnteGestoreProgettoRepository
					.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId());
			return referentiDelegati;
		}).when(referentiDelegatiEnteGestoreProgettoService).cancellaReferentiDelegatiProgetto(progetto1.getId());
		doAnswer(invocation -> {
			List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiDelegati = this.referentiDelegatiEntePartnerRepository
					.getReferentiDelegatiEnteGestoreProgettoByIdProgetto(progetto1.getId());
			return referentiDelegati;
		}).when(referentiDelegatiEntePartnerService).cancellaReferentiDelegatiPartner(progetto1.getId());
		doAnswer(invocation -> {
			List<EnteSedeProgetto> enteSedeProgetto = this.enteSedeProgettoRepository
					.getEnteSedeProgettoByIdProgetto(progetto1.getId());
			return enteSedeProgetto;
		}).when(enteSedeProgettoService).cancellaEnteSedeProgetto(progetto1.getId());
		progettoService.cancellaOTerminaProgetto(progetto1, new Date());
		verify(progettoRepository, times(1)).delete(progetto1);
	}

	// @Test
	public void cancellaOTerminaProgettoAttivoConStatoGestoreTest() throws Exception {
		// test con progetto ATTIVABILE o ATTIVO e statoGestoreProgetto == "ATTIVO"
		progetto1.setStato("ATTIVO");
		progetto1.setStatoGestoreProgetto(StatoEnum.ATTIVO.getValue());
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		progetto1.setEnteGestoreProgetto(ente1);
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiDelegati = new ArrayList<>();
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(referentiDelegatiEnteGestoreProgettoService.getReferentiEDelegatiProgetto(progetto1.getId()))
				.thenReturn(referentiDelegati);
		doNothing().when(storicoService).storicizzaEnteGestoreProgetto(progetto1, StatoEnum.TERMINATO.getValue());
		doNothing().when(enteService).terminaEntiPartner(progetto1.getId());
		doNothing().when(enteSedeProgettoService).cancellaOTerminaEnteSedeProgetto(progetto1.getId());
		progettoService.cancellaOTerminaProgetto(progetto1, currentDate);
		assertThat(progetto1.getStatoGestoreProgetto()).isEqualTo("TERMINATO");
		verify(progettoRepository, times(1)).save(progetto1);

		// test con progetto ATTIVABILE o ATTIVO e statoGestoreProgetto == "NON ATTIVO"
		progetto1.setStato("ATTIVO");
		progetto1.setStatoGestoreProgetto(StatoEnum.NON_ATTIVO.getValue());
		progetto1.setEnteGestoreProgetto(ente1);
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		when(referentiDelegatiEnteGestoreProgettoService.getReferentiEDelegatiProgetto(progetto1.getId()))
				.thenReturn(referentiDelegati);
		doNothing().when(enteService).terminaEntiPartner(progetto1.getId());
		doNothing().when(enteSedeProgettoService).cancellaOTerminaEnteSedeProgetto(progetto1.getId());
		progettoService.cancellaOTerminaProgetto(progetto1, currentDate);
		assertThat(progetto1.getStatoGestoreProgetto()).isEqualTo(null);
		verify(progettoRepository, times(2)).save(progetto1);
	}

	// @Test
	public void attivaProgettoKOTest() {
		// test KO per progetto non presente
		when(progettoRepository.findById(progetto1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> progettoService.attivaProgetto(progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
		verify(progettoRepository, times(0)).save(progetto1);

		// test KO per progetto con stato diverso da ATTIVABILE
		when(progettoRepository.findById(progetto1.getId())).thenReturn(progettoOptional);
		Assertions.assertThrows(ProgettoException.class, () -> progettoService.attivaProgetto(progetto1.getId()));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).save(progetto1);
	}
}
