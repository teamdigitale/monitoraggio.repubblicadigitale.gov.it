package it.pa.repdgt.ente.service;

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

import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ProgettoRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;

@ExtendWith(MockitoExtension.class)
public class ProgettoServiceTest {
	
	@Mock
	private ProgettoRepository progettoRepository;
	@Mock
	private EnteService enteService;

	@Autowired
	@InjectMocks
	private ProgettoService progettoService;
	
	ProgettoEntity progetto1;
	ProgettoLightEntity progettoLightEntity;
	EnteEntity ente1;
	List<Long> listaId;
	List<ProgettoEntity> listaProgetti;
	
	@BeforeEach
	public void setUp() {
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progettoLightEntity = new ProgettoLightEntity();
		progettoLightEntity.setId(progetto1.getId());
		ente1 = new EnteEntity();
		ente1.setId(1L);
		listaId = new ArrayList<>();
		listaId.add(ente1.getId());
		listaProgetti = new ArrayList<>();
		listaProgetti.add(progetto1);
	}
	
	@Test
	public void getProgettoByIdTest() {
		when(this.progettoRepository.findById(progetto1.getId())).thenReturn(Optional.of(progetto1));
		progettoService.getProgettoById(progetto1.getId());
	}
	
	@Test
	public void getProgettoByIdKOTest() {
		//test KO per progetto non trovato
		when(this.progettoRepository.findById(progetto1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> progettoService.getProgettoById(progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getProgettoLightByIdTest() {
		when(this.progettoRepository.findProgettoLightById(progetto1.getId())).thenReturn(Optional.of(progettoLightEntity));
		progettoService.getProgettoLightById(progetto1.getId());
	}
	
	@Test
	public void getProgettoLightByIdKOTest() {
		//test KO per progetto non trovato
		when(this.progettoRepository.findProgettoLightById(progetto1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> 	progettoService.getProgettoLightById(progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void esisteProgettoByIdTest() {
		when(this.progettoRepository.existsById(progetto1.getId())).thenReturn(true);
		progettoService.esisteProgettoById(progetto1.getId());
	}
	
	@Test
	public void getStatoProgettoByIdTest() {
		when(this.progettoRepository.findById(progetto1.getId())).thenReturn(Optional.of(progetto1));
		progettoService.getStatoProgettoById(progetto1.getId());
	}
	
	@Test
	public void getIdProgettiByIdEnteTest() {
		when(this.progettoRepository.findIdProgettiByIdEnte(ente1.getId())).thenReturn(listaId);
		progettoService.getIdProgettiByIdEnte(ente1.getId());
	}
	
	@Test
	public void getIdProgettiEntePartnerByIdEnteTest() {
		when(this.progettoRepository.findIdProgettiEntePartnerByIdEnte(ente1.getId())).thenReturn(listaId);
		progettoService.getIdProgettiEntePartnerByIdEnte(ente1.getId());
	}
	
	@Test
	public void countProgettiEnteTest() {
		when(this.progettoRepository.countProgettiEnte(ente1.getId())).thenReturn(1);
		progettoService.countProgettiEnte(ente1.getId());
	}
	
	@Test
	public void countProgettiEntePartnerTest() {
		when(this.progettoRepository.countProgettiEntePartner(ente1.getId())).thenReturn(1);
		progettoService.countProgettiEntePartner(ente1.getId());
	}
	
	@Test
	public void getProgettiByIdEnteTest() {
		when(this.progettoRepository.getProgettiByIdEnte(ente1.getId())).thenReturn(listaProgetti);
		progettoService.getProgettiByIdEnte(ente1.getId());
	}
	
	@Test
	public void salvaProgettoTest() {
		when(this.progettoRepository.save(progetto1)).thenReturn(progetto1);
		progettoService.salvaProgetto(progetto1);
	}
	
	@Test
	public void salvaOAggiornaProgettoTest() {
		when(this.progettoRepository.save(progetto1)).thenReturn(progetto1);
		progettoService.salvaOAggiornaProgetto(progetto1);
	}
	
	@Test
	public void assegnaEnteGestoreProgettoTest() {
		when(this.progettoRepository.findById(progetto1.getId())).thenReturn(Optional.of(progetto1));
		when(this.enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		progettoService.assegnaEnteGestoreProgetto(progetto1.getId(), ente1.getId());
	}
	
	@Test
	public void assegnaEnteGestoreProgettoKOTest() {
		//test KO per progetto inesistente
		when(this.progettoRepository.findById(progetto1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(EnteException.class, () -> 	progettoService.assegnaEnteGestoreProgetto(progetto1.getId(), ente1.getId()));
		assertThatExceptionOfType(EnteException.class);
		
		//test KO per ente inesistente
		when(this.progettoRepository.findById(progetto1.getId())).thenReturn(Optional.of(progetto1));
		when(this.enteService.getEnteById(ente1.getId())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(EnteException.class, () -> 	progettoService.assegnaEnteGestoreProgetto(progetto1.getId(), ente1.getId()));
		assertThatExceptionOfType(EnteException.class);
	}
}
