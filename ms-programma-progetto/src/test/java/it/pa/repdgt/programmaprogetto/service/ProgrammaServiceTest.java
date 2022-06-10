package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.repository.ProgrammaRepository;
import it.pa.repdgt.programmaprogetto.repository.RuoloRepository;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;

@ExtendWith(MockitoExtension.class)
public class ProgrammaServiceTest {

	@Mock
	private ProgrammaRepository programmaRepository;
	@Mock
	private RuoloRepository ruoloRepository;
	@Mock
	private RuoloService ruoloService;
	@Mock
	List<ProgrammaEntity> listaProgrammi;
	@Mock
	List<String> listaStati;
	@Mock
	Set<String> setStati;
	@Mock
	List<String> listaPolicies;
	@Mock
	Set<String> setPolicies;
	
	@Autowired
	@InjectMocks
	private ProgrammaService programmaService;
	
	ProgrammaEntity programma1;
	ProgrammaEntity programma2;
	Optional<ProgrammaEntity> programmaOptional;
	Optional<String> stato; 
	Optional<String> policy;
	FiltroRequest filtro;
	ProgettoFiltroRequest progettoFiltro;
	ProgrammiParam progParam;
	Page<ProgrammaEntity> pagina;
	List<String> listaRuoli;
	int currPage;
	int pageSize;
	
	@BeforeEach
	public void setUp() {
		programma1 = new ProgrammaEntity();
		programma2 = new ProgrammaEntity();
		programma1.setNome("programma1");
		programma1.setId(1L);
		programma1.setStato("ATTIVO");
		programma1.setPolicy(PolicyEnum.RFD);
		programma2.setNome("programma2");
		programma2.setId(2L);
		programma2.setStato("ATTIVO");
		programma1.setPolicy(PolicyEnum.RFD);
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
		stato = Optional.of(programma1.getStato());
		listaPolicies = new ArrayList<>();
		listaPolicies.add("RDF");
		listaPolicies.add("SCD");
		setPolicies = new HashSet<>();
		setPolicies.add("RDF");
		setPolicies.add("SCD");
		policy = Optional.of(programma1.getPolicy().getValue());
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
//		when(programmaService.getProgrammaById(programma1.getId())).thenReturn(new ProgrammaEntity());
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
		Assertions.assertThrows( ProgrammaException.class, () -> programmaService.getAllStatiDropdown(progParam, filtro));
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
		Assertions.assertThrows( ProgrammaException.class, () -> programmaService.getAllPoliciesDropdown(progParam, filtro));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).findAllPolicies(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
		
		//Test KO stato programma non trovato
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		this.programmaService.getAllPoliciesDropdown(progParam, filtro);
		Assertions.assertThrows(ResourceNotFoundException.class, () -> programmaService.getPolicyProgrammaByProgrammaId(progParam.getIdProgramma()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
}
