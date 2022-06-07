package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.repository.ProgrammaRepository;
import it.pa.repdgt.programmaprogetto.repository.RuoloRepository;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

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
	
	@Autowired
	@InjectMocks
	private ProgrammaService programmaService;
	
	ProgrammaEntity programma1;
	ProgrammaEntity programma2;
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
		programma2.setNome("programma2");
		programma2.setId(2L);
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
		verify(programmaRepository, atLeastOnce()).findProgrammiByPolicy("", filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getStati());
	}
	
	// ruoli: REG - DEG - REGP - DEGP - REPP - DEPP
	@Test
	public void getAllProgrammiPaginatiTest() {
		//getAll programmi per REG
		listaRuoli = new ArrayList<>();
		listaRuoli.add("REG");
		progParam.setCodiceRuolo("REG");
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllProgrammiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaProgrammi);
		Page<ProgrammaEntity> paginaProgrammi = programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro);
		assertThat(listaProgrammi.size()).isEqualTo(2);
		assertThat(paginaProgrammi.getTotalElements()).isEqualTo(pagina.getTotalElements());
		verify(programmaRepository, atLeastOnce()).findProgrammiByPolicy("", filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getStati());
	}
	
	@Test
	public void getAllProgrammiPaginatiKOTest() {
		//Test KO per ruolo non definito per l'utente
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows( ProgrammaException.class, () -> programmaService.getAllProgrammiPaginati(progParam, currPage, pageSize, filtro));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(programmaRepository, times(0)).findAll(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
		
		//Test KO per pagina non trovata
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		Assertions.assertThrows( ProgrammaException.class, () -> programmaService.getAllProgrammiPaginati(progParam, 11, pageSize, filtro));
		assertThatExceptionOfType(ProgrammaException.class);
	}
	
	//stati per utente DTD
	@Test
	public void getAllStatiDropdownTest() {
		when(ruoloService.getCodiceRuoliByCodiceFiscaleUtente(progParam.getCfUtente())).thenReturn(listaRuoli);
		when(programmaService.getAllStatiByRuoloAndIdProgramma(progParam.getCodiceRuolo(), progParam.getIdProgramma(), filtro)).thenReturn(listaStati);
		this.programmaService.getAllStatiDropdown(progParam, filtro);
		assertThat(listaStati.size()).isEqualTo(2);
		verify(programmaRepository, atLeastOnce()).findAllStati(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getPolicies(), filtro.getStati());
		
	}
	
}
