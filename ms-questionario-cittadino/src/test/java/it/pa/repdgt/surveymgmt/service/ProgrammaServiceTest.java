package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.surveymgmt.repository.ProgrammaRepository;

@ExtendWith(MockitoExtension.class)
public class ProgrammaServiceTest {
	
	@Mock
	private ProgrammaRepository programmaRepository;
	
	@Autowired
	@InjectMocks
	private ProgrammaService programmaService;
	
	ProgrammaEntity programma; 
	
	@BeforeEach
	public void setUp() {
		programma = new ProgrammaEntity();
		programma.setId(1L);
	}
		
	@Test
	public void getProgrammaByIdTest() {
		when(this.programmaRepository.findById(programma.getId())).thenReturn(Optional.of(programma));
		ProgrammaEntity risultato = programmaService.getProgrammaById(programma.getId());
		assertThat(risultato.getId()).isEqualTo(programma.getId());
	}
}
