package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import it.pa.repdgt.programmaprogetto.bean.DettaglioEntiPartnerBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioProgettoBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioSediBean;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.exception.ProgettoException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.mapper.ProgettoMapper;
import it.pa.repdgt.programmaprogetto.mapper.ProgrammaMapper;
import it.pa.repdgt.programmaprogetto.repository.EnteRepository;
import it.pa.repdgt.programmaprogetto.repository.ProgettoRepository;
import it.pa.repdgt.programmaprogetto.repository.ProgrammaRepository;
import it.pa.repdgt.programmaprogetto.repository.QuestionarioTemplateSqlRepository;
import it.pa.repdgt.programmaprogetto.repository.RuoloRepository;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.repository.storico.StoricoEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.service.storico.StoricoService;

@ExtendWith(MockitoExtension.class)
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
	private RuoloService ruoloService;
	@Mock
	private ProgrammaService programmaService;
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
	Page<ProgettoEntity> pagina;
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
		progParam.setCfUtente("UIHPLW87R49F205X");
		progParam.setCodiceRuolo("DTD");
		progParam.setFiltroRequest(filtro);
		progParam.setIdProgramma(1L);
		progettiParam = new ProgettiParam();
		progettiParam.setCfUtente("UIHPLW87R49F205X");
		progettiParam.setCodiceRuolo("DTD");
		progettiParam.setFiltroRequest(progettoFiltro);
		progettiParam.setIdProgramma(1L);
		progettiParam.setIdProgetto(1L);
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setNome("progetto 1");
		progetto1.setStato("ATTIVO");
		progetto1.setProgramma(programma1);
		listaProgetti = new ArrayList<>();
		listaProgetti.add(progetto1);
		pagina = new PageImpl<>(listaProgetti);
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
	
	//test getAllProgettiPaginati per utenti DTD
	@Test
	public void getAllProgettiPaginatiDTDTest() {
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getProgettiByRuolo(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaProgetti);
		Page<ProgettoEntity> paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro);
		assertThat(listaProgetti.size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(progettoRepository, times(1)).findAll(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	//test getAllProgettiPaginati per utenti DSCU
	@Test
	public void getAllProgettiPaginatiDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuolo("DSCU");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getProgettiByRuolo(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaProgetti);
		Page<ProgettoEntity> paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro);
		assertThat(listaProgetti.size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(progettoRepository, times(1)).findByPolicy(PolicyEnum.SCD.toString(), progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%",  progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	// test getAllProgettiPaginati per utenti con ruoli: REG - DEG
	@Test
	public void getAllProgettiPaginatiREGTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getProgettiByRuolo(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaProgetti);
		Page<ProgettoEntity> paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro);
		assertThat(listaProgetti.size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(progettoRepository, times(1)).findProgettiPerReferenteDelegatoGestoreProgramma(programma1.getId(), progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),  progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	// test getAllProgettiPaginati per utenti con ruoli: REGP - DEGP
	@Test
	public void getAllProgettiPaginatiREGPTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuolo("REGP");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoRepository.findById(progettiParam.getIdProgetto())).thenReturn(progettoOptional);
		Page<ProgettoEntity> paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro);
		assertThat(progettoOptional.get().getId()).isEqualTo(progetto1.getId());
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(progettoRepository, times(1)).findById(progetto1.getId());
	}
	
	// test getAllProgettiPaginati per utenti con ruoli: REPP - DEPP
	@Test
	public void getAllProgettiPaginatiREPPTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REPP");
		progettiParam.setCodiceRuolo("REPP");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoRepository.findById(progettiParam.getIdProgetto())).thenReturn(progettoOptional);
		Page<ProgettoEntity> paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro);
		assertThat(progettoOptional.get().getId()).isEqualTo(progetto1.getId());
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(progettoRepository, times(1)).findById(progetto1.getId());
	}
	
	//test getAllProgettiPaginati per utenti con ruoli non predefiniti
	@Test
	public void getAllProgettiPaginatiRuoloNonPredefinitoTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getProgettiByRuolo(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaProgetti);
		Page<ProgettoEntity> paginaProgetti = this.progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro);
		assertThat(listaProgetti.size()).isEqualTo(1);
		assertThat(paginaProgetti.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(progettoRepository, times(1)).findAll(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	@Test
	public void getAllProgettiPaginatiKOTest() {
		//Test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ProgettoException.class, () -> progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).findAll(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(), progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	
		//Test KO per pagina non trovata
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		Assertions.assertThrows(ProgettoException.class, () -> progettoService.getAllProgettiPaginati(progettiParam, 11, pageSize, progettoFiltro));
		assertThatExceptionOfType(ProgettoException.class);
		
		//Test KO per progetto non trovato
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuolo("REGP");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		Assertions.assertThrows(ResourceNotFoundException.class, () -> progettoService.getAllProgettiPaginati(progettiParam, currPage, pageSize, progettoFiltro));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	// test getAllProgrammiDropdown
	@Test
	public void getAllProgrammiDropdownPerProgettiTest() {
		ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
		programmaLightDropdownResource.setId(programma1.getId());
		programmaLightDropdownResource.setNome(programma1.getNome());
		List<ProgrammaDropdownResource> programmiLightDropdown = new ArrayList<>();
		programmiLightDropdown.add(programmaLightDropdownResource);	
		when(programmaService.getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro)).thenReturn(programmiLightDropdown);
		progettoService.getAllProgrammiDropdownPerProgetti(progettiParam);
		assertThat(programmiLightDropdown.size()).isEqualTo(1);
		verify(programmaService, times(1)).getAllProgrammiDropdownPerProgetti(progettiParam, progettoFiltro);
	}
	
	// test getAllPoliciesDropdown
	@Test
	public void getAllPoliciesDropdownPerProgettiTest() {
		when(programmaService.getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro)).thenReturn(listaPolicies);
		progettoService.getAllPoliciesDropdownPerProgetti(progettiParam);
		assertThat(listaPolicies.size()).isEqualTo(2);
		verify(programmaService, times(1)).getAllPoliciesDropdownPerProgetti(progettiParam, progettoFiltro);
	}
	
	// test getAllStatiDropdown per utenti DTD
	@Test
	public void getAllStatiDropdownDTDTest() {
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findAllStati(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),  progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	// test getAllStatiDropdown per utenti DSCU
	@Test
	public void getAllStatiDropdownDSCUTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("DSCU");
		progettiParam.setCodiceRuolo("DSCU");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findStatiByPolicy(PolicyEnum.SCD.toString(), progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	// test getAllStatiDropdown per utenti con ruoli: REG - DEG
	@Test
	public void getAllStatiDropdownREGTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progettiParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getStatiPerReferenteDelegatoGestoreProgramma(progettiParam.getIdProgramma(), progettoFiltro)).thenReturn(listaStati);
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findStatiPerReferenteDelegatoGestoreProgramma(progettiParam.getIdProgramma(), progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),  progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	// test getAllStatiDropdown per utenti con ruoli: REGP - DEGP
	@Test
	public void getAllStatiDropdownREGPTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuolo("REGP");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(progettoOptional.get().getNome()).isEqualTo(progetto1.getNome());
		verify(progettoRepository, times(1)).findById(progettiParam.getIdProgramma());
	}
	
	// test getAllStatiDropdown per utenti con ruoli: REPP - DEPP
	@Test
	public void getAllStatiDropdownREPPTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REPP");
		progettiParam.setCodiceRuolo("REPP");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(progettoOptional.get().getNome()).isEqualTo(progetto1.getNome());
		verify(progettoRepository, times(1)).findById(progettiParam.getIdProgramma());
	}
	
	// test getAllProgettiPaginati per utenti con ruolo non predefinito
	@Test
	public void getAllStatiDropdownRuoloNonPredefinitoTest() {
		listaRuoli = new ArrayList<>();
		listaRuoli.add("RUOLONONPREDEFINITO");
		progettiParam.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoService.getAllStatiByRuoloAndIdProgramma(progettiParam.getCodiceRuolo(), progettiParam.getCfUtente(), progettiParam.getIdProgramma(), progettiParam.getIdProgetto(), progettoFiltro)).thenReturn(listaStati);
		progettoService.getAllStatiDropdown(progettiParam, progettoFiltro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(progettoRepository, times(1)).findAllStati(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),  progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
	}
	
	@Test
	public void getAllStatiDropdownKOTest() {
		//test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ProgettoException.class, () -> progettoService.getAllStatiDropdown(progettiParam, progettoFiltro));
		assertThatExceptionOfType(ProgettoException.class);
		verify(progettoRepository, times(0)).findAllStati(progettoFiltro.getCriterioRicerca(), "%" + progettoFiltro.getCriterioRicerca() + "%", progettoFiltro.getPolicies(),  progettoFiltro.getIdsProgrammi(), progettoFiltro.getStati());
		
		//test KO per progetto non trovato
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REGP");
		progettiParam.setCodiceRuolo("REGP");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progettiParam.getCfUtente())).thenReturn(listaRuoli);
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> progettoService.getAllStatiDropdown(progettiParam, progettoFiltro));
		assertThatExceptionOfType(ResourceNotFoundException.class);
		verify(progettoRepository, times(1)).findById(progettiParam.getIdProgramma());
	}
	
	@Test
	public void getSchedaProgettoByIdTest() {
		DettaglioProgettoBean dettaglioProgetto = new DettaglioProgettoBean();
		List<Long> idsEntiPartner = new ArrayList<>();
		idsEntiPartner.add(ente1.getId());
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
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
					 dettaglioEntePartner.setReferenti(this.entePartnerService.getReferentiEntePartnerProgetto(progettiParam.getIdProgetto(), idEnte));
					 dettaglioEntePartner.setStato(this.entePartnerService.getStatoEntePartner(progettiParam.getIdProgetto(), idEnte));
					 return dettaglioEntePartner;
				 })
				 .collect(Collectors.toList());
		when(sedeService.getSediByIdProgetto(progettiParam.getIdProgetto())).thenReturn(listaSedi);
		Map<SedeEntity, List<Long>> mappaSediProgettoEnte = new HashMap<>();
		when(enteService.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sede.getId())).thenReturn(idsEntiPartner);
		listaSedi.forEach(sedeProgetto -> {
			mappaSediProgettoEnte.put(sedeProgetto, this.enteService.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sedeProgetto.getId()));
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
						    dettaglioSede.setRuoloEnte(this.enteService.getRuoloEnteByIdProgettoAndIdSedeAndIdEnte(progettiParam.getIdProgetto(), sede.getId(), idEnte));
						    dettaglioSede.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(progettiParam.getIdProgetto(), sede.getId(), idEnte));
						    dettaglioSede.setServiziErogati(sede.getServiziErogati());
						    dettaglioSede.setEnteDiRiferimento(this.enteService.getEnteById(idEnte).getNome());
						    dettaglioSede.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(progettiParam.getIdProgetto(), sede.getId(), idEnte));
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
	
	//test con ente gestore programma del programma1 a null
	@Test
	public void getSchedaProgettoByIdTest2() {
		DettaglioProgettoBean dettaglioProgetto = new DettaglioProgettoBean();
		List<Long> idsEntiPartner = new ArrayList<>();
		idsEntiPartner.add(ente1.getId());
		when(progettoRepository.findById(progettiParam.getIdProgramma())).thenReturn(progettoOptional);
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
					 dettaglioEntePartner.setReferenti(this.entePartnerService.getReferentiEntePartnerProgetto(progettiParam.getIdProgetto(), idEnte));
					 dettaglioEntePartner.setStato(this.entePartnerService.getStatoEntePartner(progettiParam.getIdProgetto(), idEnte));
					 return dettaglioEntePartner;
				 })
				 .collect(Collectors.toList());
		when(sedeService.getSediByIdProgetto(progettiParam.getIdProgetto())).thenReturn(listaSedi);
		Map<SedeEntity, List<Long>> mappaSediProgettoEnte = new HashMap<>();
		when(enteService.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sede.getId())).thenReturn(idsEntiPartner);
		listaSedi.forEach(sedeProgetto -> {
			mappaSediProgettoEnte.put(sedeProgetto, this.enteService.getIdEnteByIdProgettoAndIdSede(progettiParam.getIdProgetto(), sedeProgetto.getId()));
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
						    dettaglioSede.setRuoloEnte(this.enteService.getRuoloEnteByIdProgettoAndIdSedeAndIdEnte(progettiParam.getIdProgetto(), sede.getId(), idEnte));
						    dettaglioSede.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(progettiParam.getIdProgetto(), sede.getId(), idEnte));
						    dettaglioSede.setServiziErogati(sede.getServiziErogati());
						    dettaglioSede.setEnteDiRiferimento(this.enteService.getEnteById(idEnte).getNome());
						    dettaglioSede.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(progettiParam.getIdProgetto(), sede.getId(), idEnte));
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
}
