package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

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
import it.pa.repdgt.shared.entity.storico.StoricoEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.repository.storico.StoricoEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.service.storico.StoricoService;

@ExtendWith(MockitoExtension.class)
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
	Page<ProgrammaEntity> pagina;
	List<String> listaRuoli;
	int currPage;
	int pageSize;
	ProgettoEntity progetto1;
	QuestionarioTemplateEntity questionario1;
	
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
		progettoFiltro.setCriterioRicerca("programma2");
		progettoFiltro.setPolicies(null);
		progettoFiltro.setStati(null);
		List<String> idsProgrammi = new ArrayList<>();
		idsProgrammi.add("1");
		idsProgrammi.add("2");
		progettoFiltro.setIdsProgrammi(idsProgrammi);
		progParam = new ProgrammiParam();
		progParam.setCfUtente("UIHPLW87R49F205X");
		progParam.setCodiceRuolo("DTD");
		progParam.setFiltroRequest(filtro);
		progParam.setIdProgramma(1L);
		progettiParam = new ProgettiParam();
		progettiParam.setCfUtente("UIHPLW87R49F205X");
		progettiParam.setCodiceRuolo("DTD");
		progettiParam.setFiltroRequest(progettoFiltro);
		progettiParam.setIdProgramma(1L);
		pagina = new PageImpl<>(listaProgrammi);
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
	}
	
	
	//Test di getAllProgrammi()
	@Test
	public void getAllProgrammiTest() {
		when(programmaRepository.findAll()).thenReturn(listaProgrammi);
		List<ProgrammaEntity> programmi = programmaService.getAllProgrammi();
		assertThat(programmi).isNotEmpty();
		assertThat(programmi.size()).isEqualTo(2);
		verify(programmaRepository, times(1)).findAll();
	}
	
	//Test di getAllProgrammi(FiltroRequest filtroRequest)
	@Test
	public void getAllProgrammiConFiltroRequestTest() {
		when(programmaRepository.findAll(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati())).thenReturn(listaProgrammi);
		List<ProgrammaEntity> programmi = programmaService.getAllProgrammi(filtro);
		assertThat(programmi).isNotEmpty();
		assertThat(programmi.size()).isEqualTo(2);
		verify(programmaRepository, times(1)).findAll(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}
	
	//Test di getAllProgrammi(ProgettoFiltroRequest filtroRequest)
	@Test
	public void getAllProgrammiConProgettoFiltroRequestTest() {
		when(programmaRepository.findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi())).thenReturn(listaProgrammi);
		List<ProgrammaEntity> programmi = programmaService.getAllProgrammi(progettoFiltro);
		assertThat(programmi).isNotEmpty();
		assertThat(programmi.size()).isEqualTo(2);
		verify(programmaRepository, times(1)).findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
	
	@Test
	public void getAllProgrammiPaginatiPerDTDTest() {
		//getAll programmi Per DTD
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllProgrammiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaProgrammi);
		Page<ProgrammaEntity> paginaProgrammi = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		assertThat(paginaProgrammi.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findAll(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}
	
	@Test
	public void getAllProgrammiPaginatiPerDSCUTest() {
		//getAll programmi per DSCU
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progParam.setCodiceRuolo("DSCU");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllProgrammiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaProgrammi);
		Page<ProgrammaEntity> paginaProgrammi = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		assertThat(paginaProgrammi.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findProgrammiByPolicy(PolicyEnum.SCD.toString(), filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getStati());
	}
	
	// ruoli: REG - DEG - REGP - DEGP - REPP - DEPP
	@Test
	public void getAllProgrammiPaginatiTest() {
		//getAll programmi per REG
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaRepository.findById(programmaOptional.get().getId())).thenReturn(programmaOptional);
		Page<ProgrammaEntity> paginaProgrammi = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro);
		assertThat(paginaProgrammi.getTotalElements()).isNotEqualTo(pagina.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findById(programma1.getId());
	}
	
	//test con ruoli non predefiniti
	@Test
	public void getAllProgrammiPaginatiRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progParam.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllProgrammiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaProgrammi);
		Page<ProgrammaEntity> paginaProgrammi = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		assertThat(paginaProgrammi.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findAll(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}
	
	@Test
	public void getAllProgrammiPaginatiKOTest() {
		//Test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).findAll(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
		
		//Test KO per pagina non trovata
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.getAllProgrammiPaginati(progParam, 11, pageSize, filtro));
		assertThatExceptionOfType(ProgrammaException.class);
		
		//test KO per programma non trovato
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		this.programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro);
		Assertions.assertThrows(ResourceNotFoundException.class, () -> programmaService.getProgrammaById(progParam.getIdProgramma()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	//stati per utente DTD
	@Test
	public void getAllStatiDropdownPerDTDTest() {
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllStatiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllStati(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}
	
	//stati per utente DSCU
	@Test
	public void getAllStatiDropdownPerDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progParam.setCodiceRuolo("DSCU");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getStatiPerDSCU(filtro)).thenReturn(setStati);
		when(programmaRepository.findStatiByPolicy(PolicyEnum.SCD.toString(), filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getStati())).thenReturn(setStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(setStati.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findStatiByPolicy(PolicyEnum.SCD.toString(), filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getStati());
	}
	
	// ruoli: REG - DEG - REGP - DEGP - REPP - DEPP
	@Test
	public void getAllStatiDropdownTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaRepository.findStatoById(programma1.getId())).thenReturn(stato);
//		when(programmaService.getStatoProgrammaByProgrammaId(programma1.getId())).thenReturn(programma1.getStato());
//		when(programmaService.getAllStatiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(stato.get()).isEqualTo("ATTIVO");
		verify(programmaRepository, atLeastOnce()).findStatoById(programma1.getId());
	}
	
	//stati per utente con ruoli non prefediniti
	@Test
	public void getAllStatiDropdownPerRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progParam.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllStatiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllStati(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}
	
	//test per ruolo utente non trovato
	@Test
	public void getAllStatiDropdownKOTest() {
		//Test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.getAllStatiDropdown(progParam, filtro));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).findAllStati(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
		
		//Test KO stato programma non trovato
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		Assertions.assertThrows(ResourceNotFoundException.class, () -> programmaService.getStatoProgrammaByProgrammaId(progParam.getIdProgramma()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	
	//Policies per DTD
	@Test
	public void getAllPoliciesDropdownPerDTDTest() {
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaPolicies);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPolicies(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}
	
	//Policies per DSCU
	@Test
	public void getAllPoliciesDropdownPerDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progParam.setCodiceRuolo("DSCU");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getPoliciesPerDSCU()).thenReturn(setPolicies);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(setPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPoliciesPerDSCU(PolicyEnum.SCD.toString());
	}
	
	// ruoli: REG - DEG - REGP - DEGP - REPP - DEPP
	@Test
	public void getAllPoliciesDropdownTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaRepository.findPolicyById(programma1.getId())).thenReturn(policy);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPolicyById(programma1.getId());
	}
	
	//policies per utente con ruoli non prefediniti
	@Test
	public void getAllPoliciesDropdownPerRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progParam.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaPolicies);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPolicies(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
	}
	
	//test per ruolo utente non trovato
	@Test
	public void getAllPoliciesDropdownKOTest() {
		//Test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.getAllPoliciesDropdown(progParam, filtro));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).findAllPolicies(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
		
		//Test KO stato programma non trovato
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		Assertions.assertThrows(ResourceNotFoundException.class, () -> programmaService.getPolicyProgrammaByProgrammaId(progParam.getIdProgramma()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
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
		when(questionarioTemplateSqlService.getQuestionariByIdProgramma(programma1.getId())).thenReturn(listaQuestionari);
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
	
	//test con ente gestore programma del programma1 a null
	@Test
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
		when(questionarioTemplateSqlService.getQuestionariByIdProgramma(programma1.getId())).thenReturn(listaQuestionari);
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
	
	@Test
	public void creaNuovoProgrammaTest() {
		programma1.setDataInizioProgramma(new Date());
		programma1.setDataFineProgramma(new Date());
		when(programmaRepository.findByNome(programma1.getNome())).thenReturn(Optional.empty());
		when(questionarioTemplateSqlService.getQuestionarioTemplateByPolicy(programma1.getPolicy().getValue())).thenReturn(questionario1);
		when(programmaService.salvaProgramma(programma1)).thenReturn(programma1);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.getQuestionarioTemplateById(questionario1.getId())).thenReturn(questionario1);
		when(questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId())).thenReturn(true);
		programmaService.creaNuovoProgramma(programma1);
		assertThat(questionario1.getStato()).isEqualTo("ATTIVO");
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}
	
	@SuppressWarnings("deprecation")
	@Test
	public void creaNuovoProgrammaKOTest() {
		//test KO per programma inesistente
		when(programmaRepository.findByNome(programma1.getNome())).thenReturn(programmaOptional);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.creaNuovoProgramma(programma1));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
		
		//test KO per data fine antecedente quella di inizio
		Date dataInizio = new Date();
		dataInizio.setDate(13);
		Date dataFine = new Date();
		dataFine.setDate(10);
		programma1.setDataInizioProgramma(dataInizio);
		programma1.setDataFineProgramma(dataFine);
		when(programmaRepository.findByNome(programma1.getNome())).thenReturn(Optional.empty());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.creaNuovoProgramma(programma1));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}
	
	//test con stato programma ad ATTIVO
	@Test
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
	
	//test con stato programma a NON ATTIVO
	@Test
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
	
	@Test
	public void aggiornaProgrammaKOTest() {
		//test KO per programma inesistente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.aggiornaProgramma(null, programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
		
		//test KO per programma non aggiornabile
		programma1.setStato("TERMINATO");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.aggiornaProgramma(null, programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}
	
	@Test
	public void assegnaEnteGestoreProgrammaTest() {
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId());
		assertThat(programma1.getEnteGestoreProgramma()).isEqualTo(ente1);
		assertThat(programma1.getStatoGestoreProgramma()).isEqualTo("NON ATTIVO");
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}
	
	@Test
	public void assegnaEnteGestoreProgrammaKOTest() {
		//test KO per programma non trovato
		when(programmaRepository.findById(programma1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
		
		//test KO per ente non trovato
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(enteService.getEnteById(ente1.getId())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}
	
	@Test
	public void associaQuestionarioTemplateAProgrammaTest() {
		ProgrammaXQuestionarioTemplateKey programmaXQuestionarioKey = new ProgrammaXQuestionarioTemplateKey(programma1.getId(), questionario1.getId());
		ProgrammaXQuestionarioTemplateEntity programmaXQuestionario = new ProgrammaXQuestionarioTemplateEntity();
		programmaXQuestionario.setProgrammaXQuestionarioTemplateKey(programmaXQuestionarioKey);
		Optional<ProgrammaXQuestionarioTemplateEntity> programmaXQuestionarioOptional = Optional.of(programmaXQuestionario);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.getQuestionarioTemplateById(questionario1.getId())).thenReturn(questionario1);
		when(programmaXQuestionarioTemplateService.getAssociazioneQuestionarioTemplateAttivaByIdProgramma(programma1.getId())).thenReturn(programmaXQuestionarioOptional);
		programmaService.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId());
		assertThat(questionario1.getStato()).isEqualTo("ATTIVO");
		verify(questionarioTemplateSqlService, atLeastOnce()).salvaQuestionarioTemplate(questionario1);
	}
	
	@Test
	public void associaQuestionarioTemplateAProgrammaKOTest() {
		//test KO per programma non presente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(questionarioTemplateSqlService, times(0)).salvaQuestionarioTemplate(questionario1);
		
		//test KO per questionario non presente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(questionarioTemplateSqlService.esisteQuestionarioById(questionario1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.associaQuestionarioTemplateAProgramma(programma1.getId(), questionario1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(questionarioTemplateSqlService, times(0)).salvaQuestionarioTemplate(questionario1);
	}
	
	@Test
	public void terminaProgrammaTest() {
		ReferentiDelegatiEnteGestoreProgrammaKey referentiDelegatiKey = new ReferentiDelegatiEnteGestoreProgrammaKey(programma1.getId(), "DSARTN89D21N303N", ente1.getId());
		ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegati = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegati.setId(referentiDelegatiKey);
		List<ReferentiDelegatiEnteGestoreProgrammaEntity> listaReferentiDelegati = new ArrayList<>();
		listaReferentiDelegati.add(referentiDelegati);
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(progettoService.getProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		when(referentiDelegatiEnteGestoreProgrammaService.getReferentiEDelegatiProgramma(programma1.getId())).thenReturn(listaReferentiDelegati);
		doAnswer(invocation -> {
			StoricoEnteGestoreProgrammaEntity storico = new StoricoEnteGestoreProgrammaEntity();
			storico.setIdProgramma(programma1.getId());
			storico.setIdEnte(programma1.getEnteGestoreProgramma().getId());
			storico.setStato(StatoEnum.TERMINATO.getValue());
			storico.setDataOraCreazione(new Date());
			return this.storicoEnteGestoreProgrammaRepository.save(storico);
		}).when(storicoService).storicizzaEnteGestoreProgramma(programma1);
		this.programmaService.terminaProgramma(programma1.getId(), new Date());
		assertThat(programma1.getStato()).isEqualTo("TERMINATO");
		verify(programmaRepository, atLeastOnce()).save(programma1);
	}
	
	@Test
	public void terminaProgrammaKOTest() {
		//test KO per programma non presente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.terminaProgramma(programma1.getId(), new Date()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
		
		//test KO per programma non terminabile
		programma1.setStato("NON ATTIVO");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.terminaProgramma(programma1.getId(), new Date()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).save(programma1);
	}
	
	@Test
	public void cancellazioneProgrammaTest() {
		programma1.setStato("NON ATTIVO");
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		when(progettoService.getProgettiByIdProgramma(programma1.getId())).thenReturn(listaProgetti);
		programmaService.cancellazioneProgramma(programma1.getId());
		verify(programmaRepository, atLeastOnce()).delete(programma1);
	}
	
	@Test
	public void cancellazioneProgrammaKOTest() {
		//test KO per programma non presente
		when(programmaRepository.existsById(programma1.getId())).thenReturn(false);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.cancellazioneProgramma(programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).delete(programma1);
		
		//test KO per programma non cancellabile
		when(programmaRepository.existsById(programma1.getId())).thenReturn(true);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.cancellazioneProgramma(programma1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).delete(programma1);
	}
	
	//lista policies per DTD con ProgettoFiltroRequest (dropdown nella tab Progetti)
	@Test
	public void getAllPoliciesDropdownPerProgettiDTDTest() {
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), programma1.getId(), progettoFiltro)).thenReturn(listaPolicies);
		when(programmaService.getAllPolicies(progettoFiltro)).thenReturn(listaPolicies);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPoliciesByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
	
	//lista policies per DSCU con ProgettoFiltroRequest (dropdown nella tab Progetti)
	@Test
	public void getAllPoliciesDropdownPerProgettiDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuolo("DSCU");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getPoliciesPerDSCU()).thenReturn(setPolicies);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPoliciesPerDSCU(PolicyEnum.SCD.toString());
	}
	
	//lista policies per REG, DEG, REGP, DEGP, REPP, DEPP con ProgettoFiltroRequest (dropdown nella tab Progetti)
	@Test
	public void getAllPoliciesDropdownPerProgettiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaRepository.findPolicyById(programma1.getId())).thenReturn(policy);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findPolicyById(programma1.getId());
	}
	
	//lista policies per Ruoli non predefiniti con ProgettoFiltroRequest (dropdown nella tab Progetti)
	@Test
	public void getAllPoliciesDropdownPerProgettiRuoliNonPredefinitiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllPoliciesByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), programma1.getId(), progettoFiltro)).thenReturn(listaPolicies);
		when(programmaService.getAllPolicies(progettoFiltro)).thenReturn(listaPolicies);
		programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllPoliciesByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
	
	@Test
	public void getAllPoliciesDropdownPerProgettiKOTest() {
		//test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).findAllPoliciesByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
	
	//lista programmi nella dropdown (tab Progetti) per utente DTD
	@Test 
	public void getAllProgrammiDropdownPerProgettiDTDTest() {
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);		
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllProgrammiDropdownByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), progettiParam.getIdProgramma(), progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaService.getAllProgrammi(progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaMapper.toLightDropdownResourceFrom(listaProgrammi)).thenReturn(programmiLightDropdown);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
	
	//lista programmi nella dropdown (tab Progetti) per utente DSCU
	@Test 
	public void getAllProgrammiDropdownPerProgettiDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuolo("DSCU");
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);		
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllProgrammiDropdownByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), progettiParam.getIdProgramma(), progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaService.getProgrammiPerDSCU(progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaMapper.toLightDropdownResourceFrom(listaProgrammi)).thenReturn(programmiLightDropdown);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findByPolicy(PolicyEnum.SCD.toString(), progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
	
	//lista programmi nella dropdown (tab Progetti) per utente REG, DEG, REGP, DEGP, REPP, DEPP
	@Test 
	public void getAllProgrammiDropdownPerProgettiTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaRepository.findById(programma1.getId())).thenReturn(programmaOptional);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		verify(programmaRepository, atLeastOnce()).findById(programma1.getId());
	}
	
	//lista programmi nella dropdown (tab Progetti) per utente con ruolo non predefinito
	@Test 
	public void getAllProgrammiDropdownPerProgettiRuoloNonPredefinitoTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuolo("RUOLONONPREDEFINITO");
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);		
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllProgrammiDropdownByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), progettiParam.getIdProgramma(), progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaService.getAllProgrammi(progettoFiltro)).thenReturn(listaProgrammi);
		when(programmaMapper.toLightDropdownResourceFrom(listaProgrammi)).thenReturn(programmiLightDropdown);
		programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
	
	@Test 
	public void getAllProgrammiDropdownPerProgettiKOTest() {
		//test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ProgrammaException.class, () -> programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).findAllByProgettoFiltro(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getStati(), progettoFiltro.getIdsProgrammi());
	}
}
