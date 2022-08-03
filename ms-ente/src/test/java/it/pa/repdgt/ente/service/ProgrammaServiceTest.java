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
import it.pa.repdgt.ente.repository.ProgrammaRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@ExtendWith(MockitoExtension.class)
public class ProgrammaServiceTest {
	
	@Mock
	private EnteService enteService;
	@Mock
	private ProgrammaRepository programmaRepository;
	
	@Autowired
	@InjectMocks
	private ProgrammaService programmaService;
	
	ProgrammaEntity programma1;
	EnteEntity ente1;
	List<Long> listaIdProgrammi;
	List<ProgrammaEntity> listaProgrammi;
	
	@BeforeEach
	public void setUp() {
		programma1 = new ProgrammaEntity();
		programma1.setId(1L);
		ente1 = new EnteEntity();
		ente1.setId(1L);
		listaIdProgrammi = new ArrayList<>();
		listaIdProgrammi.add(programma1.getId());
		listaProgrammi = new ArrayList<>();
		listaProgrammi.add(programma1);
	}
	
	@Test
	public void esisteProgrammaByIdTest() {
		when(this.programmaRepository.existsById(programma1.getId())).thenReturn(true);
		programmaService.esisteProgrammaById(programma1.getId());
	}
	
	@Test
	public void getIdProgrammiByIdEnteTest() {
		when(this.programmaRepository.findIdProgrammiByIdEnte(ente1.getId())).thenReturn(listaIdProgrammi);
		programmaService.getIdProgrammiByIdEnte(ente1.getId());
	}
	
	@Test
	public void getProgrammaByIdTest() {
		when(this.programmaRepository.findById(programma1.getId())).thenReturn(Optional.of(programma1));
		programmaService.getProgrammaById(programma1.getId());
	}
	
	@Test
	public void getProgrammaByIdKOTest() {
		//test KO per programma non trovato
		when(this.programmaRepository.findById(programma1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> 	programmaService.getProgrammaById(programma1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void countProgrammiEnteTest() {
		when(this.programmaRepository.countProgrammiEnte(ente1.getId())).thenReturn(1);
		programmaService.countProgrammiEnte(ente1.getId());
	}
	
	@Test
	public void getIdEnteGestoreProgrammaTest() {
		when(this.programmaRepository.findIdEnteGestoreProgramma(programma1.getId())).thenReturn(ente1.getId());
		programmaService.getIdEnteGestoreProgramma(programma1.getId());
	}
	
	@Test
	public void getProgrammiByIdEnteTest() {
		when(this.programmaRepository.findProgrammiByIdEnte(ente1.getId())).thenReturn(listaProgrammi);
		programmaService.getProgrammiByIdEnte(ente1.getId());
	}
	
	@Test
	public void salvaProgrammaTest() {
		when(this.programmaRepository.save(programma1)).thenReturn(programma1);
		programmaService.salvaProgramma(programma1);
	}
	
	@Test
	public void assegnaEnteGestoreProgrammaTest() {
		when(this.programmaRepository.findById(programma1.getId())).thenReturn(Optional.of(programma1));
		when(this.enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId());
	}
	
	@Test
	public void assegnaEnteGestoreProgrammaKOTest() {
		//test KO per programma non trovato
		when(this.programmaRepository.findById(programma1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(EnteException.class, () -> 	programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId()));
		assertThatExceptionOfType(EnteException.class);
		
		//test KO per ente non trovato
		when(this.programmaRepository.findById(programma1.getId())).thenReturn(Optional.of(programma1));
		when(this.enteService.getEnteById(ente1.getId())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(EnteException.class, () -> 	programmaService.assegnaEnteGestoreProgramma(programma1.getId(), ente1.getId()));
		assertThatExceptionOfType(EnteException.class);
	}
}
