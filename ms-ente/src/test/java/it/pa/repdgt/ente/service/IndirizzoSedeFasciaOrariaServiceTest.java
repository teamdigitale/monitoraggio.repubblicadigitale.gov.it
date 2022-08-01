package it.pa.repdgt.ente.service;

import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.repository.IndirizzoSedeFasciaOrariaRepository;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;

@ExtendWith(MockitoExtension.class)
public class IndirizzoSedeFasciaOrariaServiceTest {
	
	@Mock
	private IndirizzoSedeFasciaOrariaRepository indirizzoSedeFasciaOrariaRepository;

	@Autowired
	@InjectMocks
	private IndirizzoSedeFasciaOrariaService indirizzoSedeFasciaOrariaService;
	
	IndirizzoSedeFasciaOrariaEntity indirizzoSedeFasciaOraria;
	
	@BeforeEach
	public void setUp() {
		indirizzoSedeFasciaOraria = new IndirizzoSedeFasciaOrariaEntity();
		indirizzoSedeFasciaOraria.setId(1L);
		indirizzoSedeFasciaOraria.setDomOrarioAperutura1("07:00");
		indirizzoSedeFasciaOraria.setDomOrarioChiusura1("13:00");
	}
	
	@Test
	public void getFasceOrarieByIdIndirizzoSedeTest() {
		when(this.indirizzoSedeFasciaOrariaRepository.findByIdIndirizzoSede(indirizzoSedeFasciaOraria.getId())).thenReturn(Optional.of(indirizzoSedeFasciaOraria));
		indirizzoSedeFasciaOrariaService.getFasceOrarieByIdIndirizzoSede(indirizzoSedeFasciaOraria.getId());
	}
	
	@Test
	public void salvaIndirizzoSedeFasciaOrariaTest() {
		when(this.indirizzoSedeFasciaOrariaRepository.save(indirizzoSedeFasciaOraria)).thenReturn(indirizzoSedeFasciaOraria);
		indirizzoSedeFasciaOrariaService.salvaIndirizzoSedeFasciaOraria(indirizzoSedeFasciaOraria);
	}
	
	@Test
	public void getFasceOrarieEntityByIdIndirizzoSedeTest() {
		when(this.indirizzoSedeFasciaOrariaRepository.findByIdIndirizzoSede(indirizzoSedeFasciaOraria.getId())).thenReturn(Optional.of(indirizzoSedeFasciaOraria));
		indirizzoSedeFasciaOrariaService.getFasceOrarieEntityByIdIndirizzoSede(indirizzoSedeFasciaOraria.getId());
	}
	
	@Test
	public void cancellaFasciaOrariaTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.indirizzoSedeFasciaOrariaRepository).delete(indirizzoSedeFasciaOraria);
		indirizzoSedeFasciaOrariaService.cancellaFasciaOraria(indirizzoSedeFasciaOraria);
	}
	
	@Test
	public void getFasciaOrariaByIdTest() {
		when(this.indirizzoSedeFasciaOrariaRepository.findById(indirizzoSedeFasciaOraria.getId())).thenReturn(Optional.of(indirizzoSedeFasciaOraria));
		indirizzoSedeFasciaOrariaService.getFasciaOrariaById(indirizzoSedeFasciaOraria.getId());
	}
}
