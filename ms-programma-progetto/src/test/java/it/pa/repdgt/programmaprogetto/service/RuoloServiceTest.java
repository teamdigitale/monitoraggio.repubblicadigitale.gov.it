package it.pa.repdgt.programmaprogetto.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.programmaprogetto.exception.RuoloException;

//@SpringBootTest
//@ExtendWith(MockitoExtension.class)
public class RuoloServiceTest {

	@Autowired
	@InjectMocks
	private RuoloService ruoloService;

	// @Test
	public void getCodiceRuoliByCodiceFiscaleUtente() {
		ruoloService.getCodiceRuoliByCodiceFiscaleUtente("UTENTE2");
	}

	// @Test
	public void cancellaRuoloUtenteKOTest() {
		// test KO per utente inesistente
		assertThrows(RuoloException.class, () -> ruoloService.cancellaRuoloUtente("INESISTENTE", "REG"));
	}

	// @Test
	public void cancellaRuoloUtenteKOTest2() {
		// test KO per ruolo inesistente
		assertThrows(RuoloException.class, () -> ruoloService.cancellaRuoloUtente("UTENTE2", "INESISTENTE"));
	}
}
