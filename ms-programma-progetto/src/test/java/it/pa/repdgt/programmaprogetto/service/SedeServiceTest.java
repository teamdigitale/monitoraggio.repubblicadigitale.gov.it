package it.pa.repdgt.programmaprogetto.service;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.programmaprogetto.repository.SedeRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;

//@ExtendWith(MockitoExtension.class)
public class SedeServiceTest {

	@Mock
	private SedeRepository sedeRepository;

	@Autowired
	@InjectMocks
	private SedeService sedeService;

	ProgettoEntity progetto1;
	SedeEntity sede1;
	EnteEntity ente1;
	List<SedeEntity> listaSedi;

	@BeforeEach
	public void setUp() {
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		sede1 = new SedeEntity();
		sede1.setId(1L);
		ente1 = new EnteEntity();
		ente1.setId(1L);
		listaSedi = new ArrayList<>();
		listaSedi.add(sede1);
	}

	// @Test
	public void getSediByIdProgetto() {
		when(sedeRepository.findSediByIdProgetto(progetto1.getId())).thenReturn(listaSedi);
		sedeService.getSediByIdProgetto(progetto1.getId());
		verify(sedeRepository, times(1)).findSediByIdProgetto(progetto1.getId());
	}

	// @Test
	public void getStatoSedeByIdProgettoAndIdSedeAndIdEnteTest() {
		when(sedeRepository.findStatoSedeByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId())).thenReturn("ATTIVO");
		sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId());
		verify(sedeRepository, times(1)).findStatoSedeByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId());
	}
}
