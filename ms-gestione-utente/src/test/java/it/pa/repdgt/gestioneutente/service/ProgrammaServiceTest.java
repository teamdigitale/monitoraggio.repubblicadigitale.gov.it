package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.gestioneutente.repository.ProgrammaRepository;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@ExtendWith(MockitoExtension.class)
public class ProgrammaServiceTest {

	@Mock
	private ProgrammaRepository programmaRepository;

	@Autowired
	@InjectMocks
	private ProgrammaService service;
	
	@Test
	public void getIdProgettiByRuoloUtenteTest() {
		when(this.programmaRepository.findDistinctIdProgrammiByRuoloUtente("cfUtente", "ruolo")).thenReturn(new ArrayList<Long>());
		assertThat(service.getDistinctIdProgrammiByRuoloUtente("cfUtente", "ruolo")).isNotNull();
	}
	
	@Test
	public void getProgettoByIdTest() {
		when(this.programmaRepository.findById(1L)).thenReturn(Optional.of(new ProgrammaEntity()));
		assertThat(service.getProgrammaById(1L)).isNotNull();
	}
}
