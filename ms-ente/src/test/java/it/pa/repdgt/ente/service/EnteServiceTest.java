package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

import it.pa.repdgt.ente.dto.EnteDto;
import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.EnteRepository;
import it.pa.repdgt.ente.request.FiltroRequest;
import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;

@ExtendWith(MockitoExtension.class)
public class EnteServiceTest {
	
	@Mock
	private RuoloService ruoloService;
	@Mock
	private EnteRepository enteRepository;
	
	@Autowired
	@InjectMocks
	private EnteService enteService;
	
	EntiPaginatiParam entiPaginatiParam;
	EnteEntity ente1;
	EnteDto enteDto1;
	List<EnteDto> listaEntiDto;
	Optional<EnteEntity> enteOptional; 
	Page<EnteDto> pagina;
	RuoloEntity ruolo;
	List<RuoloEntity> listaRuoli;
	FiltroRequest filtro;
	List<String> idsProgrammi;
	List<String> idsProgetti;
	List<String> profili;
	List<Map<String, String>> resultSet;
	List<EnteDto> entiDto;
	Integer currPage;
	Integer pageSize;

	@BeforeEach
	public void setup() {
		
		ruolo = new RuoloEntity();
		ruolo.setCodice("DTD");
		ente1 = new EnteEntity();
		ente1.setId(1L);
		ente1.setNome("ente1");
		enteDto1 = new EnteDto();
		enteDto1.setNome("ente1");
		enteOptional = Optional.of(ente1);
		listaEntiDto = new ArrayList<>();
		listaEntiDto.add(enteDto1);
		pagina = new PageImpl<>(listaEntiDto);
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		idsProgrammi = new ArrayList<>();
		idsProgrammi.add("104");
		idsProgetti = new ArrayList<>();
		idsProgetti.add("256");
		profili = new ArrayList<>();
		profili.add("Ente Gestore di Programma");
		filtro = new FiltroRequest();
		filtro.setCriterioRicerca("Ente");
		filtro.setIdsProgrammi(idsProgrammi);
		filtro.setIdsProgetti(idsProgetti);
		filtro.setProfili(profili);
		entiPaginatiParam = new EntiPaginatiParam();
		entiPaginatiParam.setCfUtente("UIHPLW87R49F205X");
		entiPaginatiParam.setCodiceRuolo(RuoloUtenteEnum.DTD);
		entiPaginatiParam.setFiltroRequest(filtro);
		currPage = 0;
		pageSize = 10;
		resultSet = new ArrayList<>();
		entiDto = new ArrayList<>();
	}
	
//	@Test
//	public void getAllEntiPaginatiDTDTest() {
//		when(ruoloService.getRuoliByCodiceFiscale(entiPaginatiParam.getCfUtente())).thenReturn(listaRuoli);
//		when(enteService.getAllEntiByCodiceRuoloAndIdProgramma(entiPaginatiParam)).thenReturn(listaEntiDto);
//		Page<EnteDto> paginaEntiDto = this.enteService.getAllEntiPaginati(entiPaginatiParam, currPage, pageSize);
//		assertThat(listaEntiDto.size()).isEqualTo(1);
//		assertThat(paginaEntiDto.getTotalElements()).isEqualTo(pagina.getTotalElements());
//		verify(enteRepository, times(1)).findAllEntiFiltrati(filtro.getCriterioRicerca(),
//				"%"+filtro.getCriterioRicerca()+"%",
//				filtro.getIdsProgrammi(),
//				filtro.getIdsProgetti(),
//				filtro.getProfili(),
//				null);
//	}
	
	@Test
	public void getEnteByPartitaIvaTest() {
		String partitaIva = "AAAAAAA11";
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		enteService.getEnteByPartitaIva(partitaIva);
		verify(enteRepository, times(1)).findByPartitaIva(partitaIva);
	}
	
	@Test
	public void getEnteByPartitaIvaKOTest() {
		String partitaIva = "AAAAAAA11";
		enteOptional = Optional.empty();
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		Assertions.assertThrows(ResourceNotFoundException.class, () -> enteService.getEnteByPartitaIva(partitaIva));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void creaNuovoEnteTest() {
		String partitaIva = "AAAAAAA11";
		ente1.setPiva(partitaIva);
		enteOptional = Optional.empty();
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		enteService.creaNuovoEnte(ente1);
		verify(enteRepository, times(1)).save(ente1);
	}
	
	@Test
	public void creaNuovoEnteKOTest() {
		String partitaIva = "AAAAAAA11";
		ente1.setPiva(partitaIva);
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		Assertions.assertThrows(EnteException.class, () -> enteService.creaNuovoEnte(ente1));
		assertThatExceptionOfType(EnteException.class);
		verify(enteRepository, times(0)).save(ente1);
	}
	
	@Test
	public void aggiornaEnteTest() {
		when(enteRepository.existsById(ente1.getId())).thenReturn(true);
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		enteService.aggiornaEnte(ente1, ente1.getId());
		verify(enteRepository, times(1)).save(ente1);
	}
	
	@Test
	public void aggiornaEnteKOTest() {
		enteOptional = Optional.empty();
		when(enteRepository.existsById(ente1.getId())).thenReturn(false);
		Assertions.assertThrows(EnteException.class, () -> enteService.aggiornaEnte(ente1, ente1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(enteRepository, times(0)).save(ente1);
	}
}