package it.pa.repdgt.programmaprogetto.service;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.programmaprogetto.repository.UtenteRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;

//@ExtendWith(MockitoExtension.class)
public class UtenteServiceTest {

	@Mock
	private UtenteRepository utenteRepository;

	@Autowired
	@InjectMocks
	private UtenteService utenteService;

	ProgettoEntity progetto1;
	SedeEntity sede1;
	EnteEntity ente1;

	@BeforeEach
	public void setUp() {
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		sede1 = new SedeEntity();
		sede1.setId(1L);
		ente1 = new EnteEntity();
		ente1.setId(1L);
	}

	// @Test
	public void countFacilitatoriPerSedeProgettoEnteTest() {
		when(utenteRepository.countFacilitatoriPerSedeProgettoEnte(progetto1.getId(), sede1.getId(), ente1.getId()))
				.thenReturn(2);
		utenteService.countFacilitatoriPerSedeProgettoEnte(progetto1.getId(), sede1.getId(), ente1.getId());
		verify(utenteRepository, times(1)).countFacilitatoriPerSedeProgettoEnte(progetto1.getId(), sede1.getId(),
				ente1.getId());
	}

	// @Test
	public void esisteUtenteByCodiceFiscaleTest() {
		when(utenteRepository.findByCodiceFiscale("UTENTE2")).thenReturn(Optional.of(new UtenteEntity()));
		utenteService.esisteUtenteByCodiceFiscale("UTENTE2");
		verify(utenteRepository, times(1)).findByCodiceFiscale("UTENTE2");
	}
}
