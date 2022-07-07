package it.pa.repdgt.programmaprogetto.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class RuoloServiceTest {

	@Autowired
	@InjectMocks
	private RuoloService ruoloService;
	
	@Test
	public void getCodiceRuoliByCodiceFiscaleUtente() {
		ruoloService.getCodiceRuoliByCodiceFiscaleUtente("UTENTE2");
	}
	
//	@Test
//	public void cancellaRuoloUtenteTest() {
//		ruoloService.cancellaRuoloUtente("UTENTE2", "REG");
//	}
//	
//	@Test
//	public void cancellaRuoloUtenteKOTest() {
//		//test KO per utente inesistente
//		ruoloService.cancellaRuoloUtente("INESISTENTE", "REG");
//	}
//	
//	@Test
//	public void cancellaRuoloUtenteKOTest2() {
//		//test KO per ruolo inesistente
//		ruoloService.cancellaRuoloUtente("UTENTE2", "INESISTENTE");
//	}
}
