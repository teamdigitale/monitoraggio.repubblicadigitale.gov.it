package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.repository.EnteRepository;

@ExtendWith(MockitoExtension.class)
public class EnteServiceTest {
	
	@Mock
	private EnteRepository enteRepository;

	@Autowired
	@InjectMocks
	private EnteService enteService;
	
	EnteEntity ente;
	
	@BeforeEach
	public void setUp() {
		ente = new EnteEntity();
		ente.setId(1L);
	}
	
	@Test
	public void getByIdTest() {
		when(this.enteRepository.findById(ente.getId())).thenReturn(Optional.of(ente));
		EnteEntity risultato = enteService.getById(ente.getId());
		assertThat(risultato.getId()).isEqualTo(ente.getId());
	}
	
	@Test
	public void getByIdKOTest() {
		//test KO per ente non trovato
		when(this.enteRepository.findById(ente.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> enteService.getById(ente.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
}
