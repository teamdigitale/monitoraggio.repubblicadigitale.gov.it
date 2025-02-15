package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
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

import it.pa.repdgt.programmaprogetto.bean.DettaglioProgrammaBean;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgrammaBean;
import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.mapper.ProgrammaMapper;
import it.pa.repdgt.programmaprogetto.repository.EnteRepository;
import it.pa.repdgt.programmaprogetto.repository.ProgettoRepository;
import it.pa.repdgt.programmaprogetto.repository.ProgrammaRepository;
import it.pa.repdgt.programmaprogetto.repository.QuestionarioTemplateSqlRepository;
import it.pa.repdgt.programmaprogetto.repository.RuoloRepository;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammaRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.resource.PaginaProgrammi;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;
import it.pa.repdgt.shared.entity.light.QuestionarioTemplateLightEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.StoricoEnteException;
import it.pa.repdgt.shared.repository.storico.StoricoEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.service.storico.StoricoService;

//@ExtendWith(MockitoExtension.class)
public class ProgrammaServiceTest {

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
	private RuoloService ruoloService;
	@Mock
	private ProgettoService progettoService;
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
	private ProgrammaMapper programmaMapper;
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
	private ProgrammaService programmaService;

	ProgrammaEntity programma1;
	ProgrammaEntity programma2;
	EnteEntity ente1;
	Optional<ProgrammaEntity> programmaOptional;
	Optional<EnteEntity> enteOptional;
	Optional<String> stato;
	Optional<String> policy;
	FiltroRequest filtro;
	ProgettoFiltroRequest progettoFiltro;
	ProgrammiParam progParam;
	ProgettiParam progettiParam;
	List<String> listaRuoli;
	int currPage;
	int pageSize;
	ProgettoEntity progetto1;
	QuestionarioTemplateEntity questionario1;
	PaginaProgrammi paginaProgrammi;

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
		programma1.setStatoGestoreProgramma(StatoEnum.ATTIVO.getValue());
		listaProgrammi = new ArrayList<>();
		listaProgrammi.add(programma1);
		listaProgrammi.add(programma2);
		filtro = new FiltroRequest();
		filtro.setCriterioRicerca("programma1");
		filtro.setPolicies(null);
		filtro.setStati(null);
		progettoFiltro = new ProgettoFiltroRequest();
		progettoFiltro.setCriterioRicerca("programma2");
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
		enteOptional = Optional.of(ente1);
		stato = Optional.of(programma1.getStato());
		listaPolicies = new ArrayList<>();
		listaPolicies.add("RDF");
		listaPolicies.add("SCD");
		setPolicies = new HashSet<>();
		setPolicies.add("RDF");
		setPolicies.add("SCD");
		policy = Optional.of(programma1.getPolicy().getValue());
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setNome("progetto 1");
		progetto1.setStato("ATTIVO");
		progetto1.setProgramma(programma1);
		listaProgetti = new ArrayList<>();
		listaProgetti.add(progetto1);
		questionario1 = new QuestionarioTemplateEntity();
		questionario1.setId("1");
		questionario1.setNome("questionario 1");
		questionario1.setStato("NON ATTIVO");
		listaQuestionari = new ArrayList<>();
		listaQuestionari.add(questionario1);
		paginaProgrammi = new PaginaProgrammi();
		paginaProgrammi.setPaginaProgrammi(listaProgrammi);
		paginaProgrammi.setTotalElements(2);
		paginaProgrammi.setTotalPages(1);
	}

	// Test di getAllProgrammi()
	// @Test
	public void getAllProgrammiTest() {
		when(programmaRepository.findAll()).thenReturn(listaProgrammi);
		List<ProgrammaEntity> programmi = programmaService.getAllProgrammi();
		assertThat(programmi).isNotEmpty();
		assertThat(programmi.size()).isEqualTo(2);
		verify(programmaRepository, times(1)).findAll();
	}

	// Test di getAllProgrammi(FiltroRequest filtroRequest)
	// @Test
	public void getAllProgrammiConFiltroRequestTest() {
		when(programmaRepository.findAll(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%",
				filtro.getPolicies(), filtro.getStati())).thenReturn(listaProgrammi);
		List<ProgrammaEntity> programmi = programmaService.getAllProgrammi(filtro);
		assertThat(programmi).isNotEmpty();
		assertThat(programmi.size()).isEqualTo(2);
		verify(programmaRepository, times(1)).findAll(filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}

	// Test di getAllProgrammi(ProgettoFiltroRequest filtroRequest)
	// @Test
	public void getAllProgrammiConProgettoFiltroRequestTest() {
		when(programmaRepository.findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getIdEnte())).thenReturn(listaProgrammi);
		List<ProgrammaEntity> programmi = programmaService.getAllProgrammi(progettoFiltro);
		assertThat(programmi).isNotEmpty();
		assertThat(programmi.size()).isEqualTo(2);
		verify(programmaRepository, times(1)).findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getIdEnte());
	}

	// @Test
	public void getAllProgrammiPaginatiPerDTDTest() {
		// getAll programmi Per DTD
		when(this.programmaRepository.findAllPaginati(
				filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%",
				filtro.getPolicies(),
				filtro.getStati(),
				currPage * pageSize,
				pageSize)).thenReturn(listaProgrammi);
		when(this.programmaRepository.countAll(
				filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%",
				filtro.getPolicies(),
				filtro.getStati())).thenReturn(2L);
		PaginaProgrammi paginaProgrammiResult = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize,
				filtro);
		assertThat(paginaProgrammiResult.getPaginaProgrammi().size()).isEqualTo(2);
		assertThat(paginaProgrammiResult.getTotalElements()).isEqualTo(paginaProgrammi.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findAllPaginati(filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati(), currPage, pageSize);
	}

	// @Test
	public void getAllProgrammiPaginatiPerDSCUTest() {
		// getAll programmi per DSCU
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progParam.setCodiceRuoloUtenteLoggato("DSCU");
		when(this.programmaRepository.findProgrammiByPolicyPaginati(
				PolicyEnum.SCD.toString(),
				filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%",
				filtro.getStati(),
				currPage * pageSize,
				pageSize)).thenReturn(listaProgrammi);
		when(this.programmaRepository.countProgrammiByPolicy(
				PolicyEnum.SCD.toString(),
				filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%",
				filtro.getStati())).thenReturn(2L);
		PaginaProgrammi paginaProgrammiResult = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize,
				filtro);
		assertThat(paginaProgrammiResult.getPaginaProgrammi().size()).isEqualTo(2);
		assertThat(paginaProgrammiResult.getTotalElements()).isEqualTo(paginaProgrammi.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findProgrammiByPolicyPaginati(PolicyEnum.SCD.toString(),
				filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getStati(), currPage,
				pageSize);
	}

	// ruoli: REG - DEG - REGP - DEGP - REPP - DEPP
	// @Test
	public void getAllProgrammiPaginatiTest() {
		// getAll programmi per REG
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progParam.setCodiceRuoloUtenteLoggato("REG");
		when(programmaRepository.findById(programmaOptional.get().getId())).thenReturn(programmaOptional);
		PaginaProgrammi paginaProgrammiResult = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize,
				filtro);
		assertThat(paginaProgrammiResult.getTotalElements()).isNotEqualTo(paginaProgrammi.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findById(programma1.getId());
	}

	// test con ruoli non predefiniti
	// @Test
	public void getAllProgrammiPaginatiRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progParam.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(this.programmaRepository.findAllPaginati(
				filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%",
				filtro.getPolicies(),
				filtro.getStati(),
				currPage * pageSize,
				pageSize)).thenReturn(listaProgrammi);
		when(this.programmaRepository.countAll(
				filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%",
				filtro.getPolicies(),
				filtro.getStati())).thenReturn(2L);

		PaginaProgrammi paginaProgrammiResult = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize,
				filtro);
		assertThat(paginaProgrammiResult.getPaginaProgrammi().size()).isEqualTo(2);
		assertThat(paginaProgrammiResult.getTotalElements()).isEqualTo(paginaProgrammi.getTotalElements());
	}

	// @Test
	public void getAllProgrammiPaginatiKOTest() {
		// test KO per programma non trovato
		this.programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro);
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> programmaService.getProgrammaById(progParam.getIdProgramma()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}

	// stati per utente DTD
	// @Test
	public void getAllStatiDropdownPerDTDTest() {
		when(programmaService.getAllStatiByRuoloAndIdProgramma(progParam.getCodiceRuoloUtenteLoggato(),
				progParam.getIdProgramma(), filtro)).thenReturn(listaStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllStati(filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}

	// stati per utente DSCU
	// @Test
	public void getAllStatiDropdownPerDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progParam.setCodiceRuoloUtenteLoggato("DSCU");
		when(programmaService.getStatiPerDSCU(filtro)).thenReturn(setStati);
		when(programmaRepository.findStatiByPolicy(PolicyEnum.SCD.toString(), filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%", filtro.getStati())).thenReturn(setStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(setStati.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findStatiByPolicy(PolicyEnum.SCD.toString(),
				filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getStati());
	}

	// ruoli: REG - DEG - REGP - DEGP - REPP - DEPP
	// @Test
	public void getAllStatiDropdownTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progParam.setCodiceRuoloUtenteLoggato("REG");
		when(programmaRepository.findStatoById(programma1.getId())).thenReturn(stato);
		// when(programmaService.getStatoProgrammaByProgrammaId(programma1.getId())).thenReturn(programma1.getStato());
		// when(programmaService.getAllStatiByRuoloAndIdProgramma(progParam.getCodiceRuoloUtenteLoggato(),
		// progParam.getIdProgramma(), filtro)).thenReturn(listaStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(stato.get()).isEqualTo("ATTIVO");
		verify(programmaRepository, atLeastOnce()).findStatoById(programma1.getId());
	}

	// stati per utente con ruoli non prefediniti
	// @Test
	public void getAllStatiDropdownPerRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progParam.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(programmaService.getAllStatiByRuoloAndIdProgramma(progParam.getCodiceRuoloUtenteLoggato(),
				progParam.getIdProgramma(), filtro)).thenReturn(listaStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllStati(filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}

	// test per ruolo utente non trovato
	// @Test
	public void getAllStatiDropdownKOTest() {
		// Test KO stato programma non trovato
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> programmaService.getStatoProgrammaByProgrammaId(progParam.getIdProgramma()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}

	// Policies per DTD
	// @Test
	public void getAllPoliciesDropdownPerDTDTest() {
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progParam.getCodiceRuoloUtenteLoggato(),
				progParam.getIdProgramma(), filtro)).thenReturn(listaPolicies);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPolicies(filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}

	// Policies per DSCU
	// @Test
	public void getAllPoliciesDropdownPerDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progParam.setCodiceRuoloUtenteLoggato("DSCU");
		when(programmaService.getPoliciesPerDSCU()).thenReturn(setPolicies);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(setPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPoliciesPerDSCU(PolicyEnum.SCD.toString());
	}

	// ruoli: REG - DEG - REGP - DEGP - REPP - DEPP
	// @Test
	public void getAllPoliciesDropdownTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progParam.setCodiceRuoloUtenteLoggato("REG");
		when(programmaRepository.findPolicyById(programma1.getId())).thenReturn(policy);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPolicyById(programma1.getId());
	}

	// policies per utente con ruoli non prefediniti
	// @Test
	public void getAllPoliciesDropdownPerRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progParam.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progParam.getCodiceRuoloUtenteLoggato(),
				progParam.getIdProgramma(), filtro)).thenReturn(listaPolicies);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPolicies(filtro.getCriterioRicerca(),
				"%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}

	// test per ruolo utente non trovato
	// @Test
	public void getAllPoliciesDropdownKOTest() {
		// Test KO stato programma non trovato
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> programmaService.getPolicyProgrammaByProgrammaId(progParam.getIdProgramma()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}

	// @Test
	public void getSchedaProgrammaByIdTest() {
		when(this.programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(progettoService.getProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		List<ProgettoLightEntity> progettiLight = listaProgetti.stream().map(progetto -> {
			ProgettoLightEntity progettoLight = new ProgettoLightEntity();
			progettoLight.setId(progetto.getId());
			progettoLight.setNome(progetto.getNome());
			progettoLight.setStato(progetto.getStato());
			return progettoLight;
		}).collect(Collectors.toList());
		when(questionarioTemplateSqlService.getQuestionariByIdProgramma(programma1.getId()))
				.thenReturn(listaQuestionari);
		List<QuestionarioTemplateLightEntity> questionariLight = listaQuestionari.stream().map(questionario -> {
			QuestionarioTemplateLightEntity questionarioLight = new QuestionarioTemplateLightEntity();
			questionarioLight.setId(questionario.getId());
			questionarioLight.setNome(questionario.getNome());
			questionarioLight.setStato(questionario.getStato());
			return questionarioLight;
		})
				.collect(Collectors.toList());

		DettaglioProgrammaBean dettaglioProgramma = new DettaglioProgrammaBean();
		dettaglioProgramma = programmaMapper.toDettaglioProgrammaBeanFrom(programma1);
		SchedaProgrammaBean schedaProgramma = new SchedaProgrammaBean();
		schedaProgramma.setDettaglioProgramma(dettaglioProgramma);
		schedaProgramma.setProgetti(progettiLight);
		schedaProgramma.setQuestionari(questionariLight);

		SchedaProgrammaBean schedaProgrammaMock = programmaService.getSchedaProgrammaById(programma1.getId());
		assertThat(schedaProgrammaMock.getProgetti().size()).isEqualTo(schedaProgramma.getProgetti().size());
		assertThat(schedaProgrammaMock.getQuestionari().size()).isEqualTo(schedaProgramma.getQuestionari().size());
		verify(progettoService, atLeastOnce()).getProgettiByIdProgramma(programma1.getId());
	}

	// test con ente gestore programma del programma1 a null
	// @Test
	public void getSchedaProgrammaByIdTest2() {
		when(this.programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(progettoService.getProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		List<ProgettoLightEntity> progettiLight = listaProgetti.stream().map(progetto -> {
			ProgettoLightEntity progettoLight = new ProgettoLightEntity();
			progettoLight.setId(progetto.getId());
			progettoLight.setNome(progetto.getNome());
			progettoLight.setStato(progetto.getStato());
			return progettoLight;
		}).collect(Collectors.toList());
		when(questionarioTemplateSqlService.getQuestionariByIdProgramma(programma1.getId()))
				.thenReturn(listaQuestionari);
		List<QuestionarioTemplateLightEntity> questionariLight = listaQuestionari.stream().map(questionario -> {
			QuestionarioTemplateLightEntity questionarioLight = new QuestionarioTemplateLightEntity();
			questionarioLight.setId(questionario.getId());
			questionarioLight.setNome(questionario.getNome());
			questionarioLight.setStato(questionario.getStato());
			return questionarioLight;
		})
				.collect(Collectors.toList());

		DettaglioProgrammaBean dettaglioProgramma = new DettaglioProgrammaBean();
		dettaglioProgramma = programmaMapper.toDettaglioProgrammaBeanFrom(programma1);
		SchedaProgrammaBean schedaProgramma = new SchedaProgrammaBean();
		schedaProgramma.setDettaglioProgramma(dettaglioProgramma);
		schedaProgramma.setProgetti(progettiLight);
		schedaProgramma.setQuestionari(questionariLight);
		programma1.setEnteGestoreProgramma(null);

		SchedaProgrammaBean schedaProgrammaMock = programmaService.getSchedaProgrammaById(programma1.getId());
		assertThat(schedaProgrammaMock.getProgetti().size()).isEqualTo(schedaProgramma.getProgetti().size());
		assertThat(schedaProgrammaMock.getQuestionari().size()).isEqualTo(schedaProgramma.getQuestionari().size());
		verify(progettoService, atLeastOnce()).getProgettiByIdProgramma(programma1.getId());
	}

	// @Test
	public void creaNuovoProgrammaTest() {
		programma1.setDataInizioProgramma(new Date());
		programma1.setDataFineProgramma(new Date());
		when(programmaRepository.findProgrammaByCodice(programma1.getCup())).thenReturn(Optional.empty());
		when(questionarioTemplateSqlService.getQuestionarioTemplateByPolicy(programma1.getPolicy().getValue()))
				.thenReturn(questionario1);
		when(programmaService.salvaProgramma(programma1)).thenReturn(programma1);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.getQuestionarioTemplateById(questionario1.getId()))
				.thenReturn(questionario1);
		when(questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId())).thenReturn(true);
		programmaService.creaNuovoProgramma(programma1);
		assertThat(questionario1.getStato()).isEqualTo("ATTIVO");
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}

	@SuppressWarnings("deprecation")
	// @Test
	public void creaNuovoProgrammaKOTest() {
		// test KO per programma già esistente
		when(programmaRepository.findProgrammaByCodice(programma1.getCup())).thenReturn(programmaOptional);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.creaNuovoProgramma(programma1));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);

		// test KO per data fine antecedente quella di inizio
		Date dataInizio = new Date();
		dataInizio.setDate(13);
		Date dataFine = new Date();
		dataFine.setDate(10);
		programma1.setDataInizioProgramma(dataInizio);
		programma1.setDataFineProgramma(dataFine);
		when(programmaRepository.findProgrammaByCodice(programma1.getCup())).thenReturn(Optional.empty());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.creaNuovoProgramma(programma1));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);

		// test KO per questionario inesistente
		programma1.setDataInizioProgramma(new Date());
		programma1.setDataFineProgramma(new Date());
		when(programmaRepository.findProgrammaByCodice(programma1.getCup())).thenReturn(Optional.empty());
		when(questionarioTemplateSqlService.getQuestionarioTemplateByPolicy(programma1.getPolicy().getValue()))
				.thenReturn(null);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.creaNuovoProgramma(programma1));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}

	// test con stato programma ad ATTIVO
	// @Test
	public void aggiornaProgrammaAttivoTest() {
		ProgrammaRequest programmaRequest = new ProgrammaRequest();
		programmaRequest.setNome("prova");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		doAnswer(invocation -> {
			programma1.setNome(programmaRequest.getNome());
			return programma1;
		}).when(programmaMapper).toEntityFrom(programmaRequest, programma1);
		programmaService.aggiornaProgramma(programmaRequest, programma1.getId());
		assertThat(programma1.getNome()).isEqualTo(programmaRequest.getNome());
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}

	// test con stato programma a NON ATTIVO
	// @Test
	public void aggiornaProgrammaNonAttivoTest() {
		programma1.setStato("NON ATTIVO");
		ProgrammaRequest programmaRequest = new ProgrammaRequest();
		programmaRequest.setNome("prova");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		doAnswer(invocation -> {
			programma1.setNome(programmaRequest.getNome());
			return programma1;
		}).when(programmaMapper).toEntityFrom(programmaRequest, programma1);
		programmaService.aggiornaProgramma(programmaRequest, programma1.getId());
		assertThat(programma1.getNome()).isEqualTo(programmaRequest.getNome());
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}

	// @Test
	public void aggiornaProgrammaKOTest() {
		// test KO per programma inesistente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.aggiornaProgramma(null, programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);

		// test KO per programmaRequest con codice già esistente
		ProgrammaRequest programmaRequest = new ProgrammaRequest();
		programmaRequest.setCodice("3213");
		;
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(programmaRepository.countProgrammiByCodice(programmaRequest.getCodice(), programma1.getId()))
				.thenReturn(1);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.aggiornaProgramma(programmaRequest, programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);

		// test KO per programma non aggiornabile
		programma1.setStato("TERMINATO");
		ProgrammaRequest programmaRequest2 = new ProgrammaRequest();
		programmaRequest2.setCodice("3213");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(programmaRepository.countProgrammiByCodice(programmaRequest2.getCodice(), programma1.getId()))
				.thenReturn(0);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.aggiornaProgramma(programmaRequest, programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}

	// @Test
	public void assegnaEnteGestoreProgrammaTest() {
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId());
		assertThat(programma1.getEnteGestoreProgramma()).isEqualTo(ente1);
		assertThat(programma1.getStatoGestoreProgramma()).isEqualTo("NON ATTIVO");
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}

	// @Test
	public void assegnaEnteGestoreProgrammaKOTest() {
		// test KO per programma non trovato
		when(programmaRepository.findById(programma1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);

		// test KO per ente non trovato
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(enteService.getEnteById(ente1.getId())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}

	// @Test
	public void associaQuestionarioTemplateAProgrammaTest() {
		// test con lo stato di programmaXQuestionario = ATTIVO
		ProgrammaXQuestionarioTemplateKey programmaXQuestionarioKey = new ProgrammaXQuestionarioTemplateKey(
				programma1.getId(), questionario1.getId());
		ProgrammaXQuestionarioTemplateEntity programmaXQuestionario = new ProgrammaXQuestionarioTemplateEntity();
		programmaXQuestionario.setProgrammaXQuestionarioTemplateKey(programmaXQuestionarioKey);
		programmaXQuestionario.setStato("ATTIVO");
		List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario = new ArrayList<>();
		listaProgrammaXQuestionario.add(programmaXQuestionario);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.getQuestionarioTemplateById(questionario1.getId()))
				.thenReturn(questionario1);
		when(programmaXQuestionarioTemplateService.getAssociazioneQuestionarioTemplateByIdProgramma(programma1.getId()))
				.thenReturn(listaProgrammaXQuestionario);
		programmaService.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId());
		assertThat(questionario1.getStato()).isEqualTo("ATTIVO");
		verify(questionarioTemplateSqlService, atLeastOnce()).salvaQuestionarioTemplate(questionario1);
	}

	// @Test
	public void associaQuestionarioTemplateAProgrammaTest2() {
		// test con lo stato di programmaXQuestionario = NON ATTIVO
		ProgrammaXQuestionarioTemplateKey programmaXQuestionarioKey = new ProgrammaXQuestionarioTemplateKey(
				programma1.getId(), questionario1.getId());
		ProgrammaXQuestionarioTemplateEntity programmaXQuestionario = new ProgrammaXQuestionarioTemplateEntity();
		programmaXQuestionario.setProgrammaXQuestionarioTemplateKey(programmaXQuestionarioKey);
		programmaXQuestionario.setStato("NON ATTIVO");
		List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario = new ArrayList<>();
		listaProgrammaXQuestionario.add(programmaXQuestionario);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.getQuestionarioTemplateById(questionario1.getId()))
				.thenReturn(questionario1);
		when(programmaXQuestionarioTemplateService.getAssociazioneQuestionarioTemplateByIdProgramma(programma1.getId()))
				.thenReturn(listaProgrammaXQuestionario);
		programmaService.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId());
		assertThat(questionario1.getStato()).isEqualTo("ATTIVO");
		verify(questionarioTemplateSqlService, atLeastOnce()).salvaQuestionarioTemplate(questionario1);
	}

	// @Test
	public void associaQuestionarioTemplateAProgrammaKOTest() {
		// test KO per programma non presente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService
				.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(questionarioTemplateSqlService, times(0)).salvaQuestionarioTemplate(questionario1);

		// test KO per questionario non presente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService
				.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(questionarioTemplateSqlService, times(0)).salvaQuestionarioTemplate(questionario1);
	}

	// @Test
	public void terminaProgrammaTest() throws Exception {
		// test per programma con statoEnteGestore == "ATTIVO"
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		ReferentiDelegatiEnteGestoreProgrammaKey referentiDelegatiKey = new ReferentiDelegatiEnteGestoreProgrammaKey(
				programma1.getId(), "DSARTN89D21N303N", ente1.getId());
		ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegati = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegati.setId(referentiDelegatiKey);
		List<ReferentiDelegatiEnteGestoreProgrammaEntity> listaReferentiDelegati = new ArrayList<>();
		listaReferentiDelegati.add(referentiDelegati);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(progettoService.getProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		when(referentiDelegatiEnteGestoreProgrammaService.getReferentiEDelegatiProgramma(programma1.getId()))
				.thenReturn(listaReferentiDelegati);
		doNothing().when(storicoService).storicizzaEnteGestoreProgramma(programma1, StatoEnum.TERMINATO.getValue());
		this.programmaService.terminaProgramma(programma1.getId(), currentDate);
		assertThat(programma1.getStato()).isEqualTo("TERMINATO");
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}

	// @Test
	public void terminaProgrammaTest2() throws Exception {
		// test per programma con statoEnteGestore == "NON ATTIVO"
		programma1.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		ReferentiDelegatiEnteGestoreProgrammaKey referentiDelegatiKey = new ReferentiDelegatiEnteGestoreProgrammaKey(
				programma1.getId(), "DSARTN89D21N303N", ente1.getId());
		ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegati = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegati.setId(referentiDelegatiKey);
		List<ReferentiDelegatiEnteGestoreProgrammaEntity> listaReferentiDelegati = new ArrayList<>();
		listaReferentiDelegati.add(referentiDelegati);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(progettoService.getProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		when(referentiDelegatiEnteGestoreProgrammaService.getReferentiEDelegatiProgramma(programma1.getId()))
				.thenReturn(listaReferentiDelegati);
		this.programmaService.terminaProgramma(programma1.getId(), currentDate);
		assertThat(programma1.getStato()).isEqualTo("TERMINATO");
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}

	// @Test
	public void terminaProgrammaKOTest() throws ParseException {
		// test per data terminazione nel futuro
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.terminaProgramma(programma1.getId(), new Date()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);

		// test KO per programma non presente
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.terminaProgramma(programma1.getId(), currentDate));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);

		// test KO per programma non terminabile
		SimpleDateFormat sdf2 = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c2 = Calendar.getInstance();
		c2.setTime(sdf2.parse(sdf2.format(new Date())));
		Date currentDate2 = c2.getTime();
		programma1.setStato("NON ATTIVO");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.terminaProgramma(programma1.getId(), currentDate2));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}

	// @Test
	public void terminaProgrammaKOTest2() throws Exception {
		// test KO impossibile storicizzare l'ente
		SimpleDateFormat sdf2 = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c2 = Calendar.getInstance();
		c2.setTime(sdf2.parse(sdf2.format(new Date())));
		Date currentDate2 = c2.getTime();
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		doThrow(StoricoEnteException.class).when(storicoService).storicizzaEnteGestoreProgramma(programma1,
				StatoEnum.TERMINATO.getValue());
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.terminaProgramma(programma1.getId(), currentDate2));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}

	// @Test
	public void cancellazioneProgrammaTest() {
		programma1.setStato("NON ATTIVO");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(progettoService.getProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		programmaService.cancellazioneProgramma(programma1.getId());
		verify(programmaRepository, atLeastOnce()).delete(programma1);
	}

	// @Test
	public void cancellazioneProgrammaKOTest() {
		// test KO per programma non presente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.cancellazioneProgramma(programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).delete(programma1);

		// test KO per programma non cancellabile
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		Assertions.assertThrows(ProgrammaException.class,
				() -> programmaService.cancellazioneProgramma(programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).delete(programma1);
	}

	// lista policies per DTD con ProgettoFiltroRequest (dropdown nella tab
	// Progetti)
	// @Test
	public void getAllPoliciesDropdownPerProgettiDTDTest() {
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				programma1.getId(), progettoFiltro)).thenReturn(listaPolicies);
		when(programmaService.getAllPolicies(progettoFiltro)).thenReturn(listaPolicies);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPoliciesByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getIdEnte());
	}

	// lista policies per DSCU con ProgettoFiltroRequest (dropdown nella tab
	// Progetti)
	// @Test
	public void getAllPoliciesDropdownPerProgettiDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuoloUtenteLoggato("DSCU");
		when(programmaService.getPoliciesPerDSCU()).thenReturn(setPolicies);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPoliciesPerDSCU(PolicyEnum.SCD.toString());
	}

	// lista policies per REG, DEG, REGP, DEGP, REPP, DEPP con ProgettoFiltroRequest
	// (dropdown nella tab Progetti)
	// @Test
	public void getAllPoliciesDropdownPerProgettiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuoloUtenteLoggato("REG");
		when(programmaRepository.findPolicyById(programma1.getId())).thenReturn(policy);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPolicyById(programma1.getId());
	}

	// lista policies per Ruoli non predefiniti con ProgettoFiltroRequest (dropdown
	// nella tab Progetti)
	// @Test
	public void getAllPoliciesDropdownPerProgettiRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				programma1.getId(), progettoFiltro)).thenReturn(listaPolicies);
		when(programmaService.getAllPolicies(progettoFiltro)).thenReturn(listaPolicies);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPoliciesByProgettoFiltro(progettoFiltro.getCriterioRicerca(),
				"%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),
				progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getIdEnte());
	}

	// lista programmi nella dropdown (tab Progetti) per utente DTD
	// @Test
	public void getAllProgrammiDropdownPerProgettiDTDTest() {
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);
		when(programmaService.getAllProgrammiDropdownByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				progettiParam.getIdProgramma(), progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaService.getAllProgrammi(progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaMapper.toLightDropdownResourceFrom(listaProgrammi)).thenReturn(programmiLightDropdown);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(),
				"%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),
				progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getIdEnte());
	}

	// lista programmi nella dropdown (tab Progetti) per utente DSCU
	// @Test
	public void getAllProgrammiDropdownPerProgettiDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuoloUtenteLoggato("DSCU");
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);
		when(programmaService.getAllProgrammiDropdownByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				progettiParam.getIdProgramma(), progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaService.getProgrammiPerDSCU(progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaMapper.toLightDropdownResourceFrom(listaProgrammi)).thenReturn(programmiLightDropdown);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findByPolicy(PolicyEnum.SCD.toString(),
				progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%",
				progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}

	// lista programmi nella dropdown (tab Progetti) per utente REG, DEG, REGP,
	// DEGP, REPP, DEPP
	// @Test
	public void getAllProgrammiDropdownPerProgettiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuoloUtenteLoggato("REG");
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		verify(programmaRepository, atLeastOnce()).findById(programma1.getId());
	}

	// lista programmi nella dropdown (tab Progetti) per utente con ruolo non
	// predefinito
	// @Test
	public void getAllProgrammiDropdownPerProgettiRuoloNonPredefinitoTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);
		when(programmaService.getAllProgrammiDropdownByRuoloAndIdProgramma(progettiParam.getCodiceRuoloUtenteLoggato(),
				progettiParam.getIdProgramma(), progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaService.getAllProgrammi(progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaMapper.toLightDropdownResourceFrom(listaProgrammi)).thenReturn(programmiLightDropdown);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(),
				"%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),
				progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getIdEnte());
	}

	// @Test
	public void existsProgrammaByNomeTest() {
		when(programmaRepository.findByNome(programma1.getNome())).thenReturn(programmaOptional);
		programmaService.existsProgrammaByNome(programma1.getNome());
		verify(programmaRepository, times(1)).findByNome(programma1.getNome());
	}
}
