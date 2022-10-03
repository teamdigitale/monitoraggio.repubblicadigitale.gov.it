package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
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

import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.SedeRepository;
import lombok.Setter;

@ExtendWith(MockitoExtension.class)
public class SedeServiceTest {
	
	@Mock
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Mock
	private ServizioSqlService servizioSqlService;
	@Mock
	private SedeRepository sedeRepository;
	
	@Autowired
	@InjectMocks
	private SedeService sedeService;
	
	SedeEntity sede;
	CittadiniPaginatiParam cittadiniPaginatiParam;
	FiltroListaCittadiniParam filtro;
	List<String> listaIdsSedi;
	
	@BeforeEach
	public void setUp() {
		sede = new SedeEntity();
		sede.setId(1L);
		listaIdsSedi = new ArrayList<>();
		listaIdsSedi.add(sede.getId().toString());
		filtro = new FiltroListaCittadiniParam();
		filtro.setCriterioRicerca("CRITERIORICERCA");
		filtro.setIdsSedi(listaIdsSedi);
		cittadiniPaginatiParam = new CittadiniPaginatiParam();
		cittadiniPaginatiParam.setCfUtenteLoggato("CFUTENTE");
		cittadiniPaginatiParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.toString());
		cittadiniPaginatiParam.setIdProgetto(1L);
		cittadiniPaginatiParam.setIdProgramma(1L);
		cittadiniPaginatiParam.setFiltro(filtro);
	}
	
	@Test
	public void getByIdTest() {
		when(this.sedeRepository.findById(sede.getId())).thenReturn(Optional.of(sede));
		SedeEntity risultato = sedeService.getById(sede.getId());
		assertThat(risultato.getId()).isEqualTo(sede.getId());
	}
	
	@Test
	public void getByIdKOTest() {
		//test KO per sede non trovata
		when(this.sedeRepository.findById(sede.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> sedeService.getById(sede.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getAllSediFacilitatoreFiltrateTest() {
		//test con filtro.getIdsSedi != null
		SedeProjectionImplementation sedeProjectionImplementation = new SedeProjectionImplementation();
		sedeProjectionImplementation.setId(sede.getId());
		List<SedeProjection> listaSediProjection = new ArrayList<>();
		listaSediProjection.add(sedeProjectionImplementation);
		when(this.sedeRepository.findAllSediFiltrate(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", filtro.getIdsSedi())).thenReturn(listaSediProjection);
		List<SedeProjection> risultato = sedeService.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam);
		assertThat(risultato.size()).isEqualTo(listaSediProjection.size());
		
		//test con filtro.getIdsSedi == null
		filtro.setIdsSedi(null);
		when(this.servizioSqlService.getIdsSediFacilitatoreConServiziAndCittadiniCensitiByCodFiscaleAndIdProgetto(cittadiniPaginatiParam.getCfUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto())).thenReturn(listaIdsSedi);
		when(this.sedeRepository.findAllSediFiltrate(filtro.getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%", listaIdsSedi)).thenReturn(listaSediProjection);
		List<SedeProjection> risultato2 = sedeService.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam);
		assertThat(risultato2.size()).isEqualTo(listaSediProjection.size());
	}
	
	@Setter
	public class SedeProjectionImplementation implements SedeProjection {
		private Long id;
		private String nome;

		@Override
		public Long getId() {
			return id;
		}

		@Override
		public String getNome() {
			return nome;
		}
	}
}
