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

import it.pa.repdgt.gestioneutente.repository.ProgettoRepository;
import it.pa.repdgt.shared.entity.ProgettoEntity;

//@ExtendWith(MockitoExtension.class)
public class ProgettoServiceTest {

	@Mock
	private ProgettoRepository progettoRepository;

	@Autowired
	@InjectMocks
	private ProgettoService service;

	// @Test
	public void getIdProgettiByRuoloUtenteTest() {
		when(this.progettoRepository.findDistinctIdProgettiByRuoloUtente("cfUtente", "ruolo")).thenReturn(new ArrayList<Long>());
		assertThat(service.getDistinctIdProgettiByRuoloUtente("cfUtente", "ruolo")).isNotNull();
	}

	// @Test
	public void getProgettoByIdTest() {
		when(this.progettoRepository.findById(1L)).thenReturn(Optional.of(new ProgettoEntity()));
		assertThat(service.getProgettoById(1L)).isNotNull();
	}
}
