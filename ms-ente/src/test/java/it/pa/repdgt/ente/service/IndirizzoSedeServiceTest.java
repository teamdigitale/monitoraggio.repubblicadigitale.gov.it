package it.pa.repdgt.ente.service;

import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import it.pa.repdgt.ente.repository.IndirizzoSedeRepository;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;

@ExtendWith(MockitoExtension.class)
public class IndirizzoSedeServiceTest {
	
	@Mock
	private IndirizzoSedeRepository indirizzoSedeRepository;

	@Autowired
	@InjectMocks
	private IndirizzoSedeService indirizzoSedeService;
	
	IndirizzoSedeEntity indirizzoSedeEntity;
	List<IndirizzoSedeProjection> listaIndirizzoSede;
	
	@BeforeEach
	public void setUp() {
		indirizzoSedeEntity = new IndirizzoSedeEntity();
		indirizzoSedeEntity.setId(1L);
		indirizzoSedeEntity.setDataOraCreazione(new Date());
		listaIndirizzoSede = new ArrayList<>();
	}
	
	@Test
	public void salvaIndirizzoSedeTest() {
		when(this.indirizzoSedeRepository.save(indirizzoSedeEntity)).thenReturn(indirizzoSedeEntity);
		indirizzoSedeService.salvaIndirizzoSede(indirizzoSedeEntity);
	}
	
	@Test
	public void getIndirizzoSedeByIdTest() {
		when(this.indirizzoSedeRepository.findById(indirizzoSedeEntity.getId())).thenReturn(Optional.of(indirizzoSedeEntity));
		indirizzoSedeService.getIndirizzoSedeById(indirizzoSedeEntity.getId());
	}
	
	@Test
	public void cancellaIndirizzoSedeByIdTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.indirizzoSedeRepository).deleteById(indirizzoSedeEntity.getId());
		indirizzoSedeService.cancellaIndirizzoSedeById(indirizzoSedeEntity.getId());
	}
}
