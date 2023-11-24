package it.pa.repdgt.programmaprogetto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;

//@SpringBootTest
//@ExtendWith(MockitoExtension.class)
public class EnteSedeProgettoServiceTest {

	@Autowired
	@InjectMocks
	private EnteSedeProgettoService enteSedeProgettoService;

	@BeforeEach
	public void setUp() {
	}

	// @Test
	public void cancellaEnteSedeProgettoTest() {
		enteSedeProgettoService.cancellaEnteSedeProgetto(256L);
	}

	// @Test
	public void cancellazioneAssociazioneEnteSedeProgettoTest() {
		EnteSedeProgettoKey enteSedeProgettoKey = new EnteSedeProgettoKey(1000L, 1L, 251L);
		EnteSedeProgetto enteSedeProgetto = new EnteSedeProgetto();
		enteSedeProgetto.setId(enteSedeProgettoKey);
		enteSedeProgettoService.cancellazioneAssociazioneEnteSedeProgetto(enteSedeProgetto);
	}

	// @Test
	public void getAssociazioneEnteSedeProgettoTest() {
		enteSedeProgettoService.getAssociazioneEnteSedeProgetto(1L, 1005L, 254L);
	}

	// @Test
	public void cancellaOTerminaEnteSedeProgettoTest() {
		enteSedeProgettoService.cancellaOTerminaEnteSedeProgetto(251L);
		enteSedeProgettoService.cancellaOTerminaEnteSedeProgetto(250L);
	}

	// @Test
	public void terminazioneAssociazioneEnteSedeProgettoTest() {
		EnteSedeProgettoKey enteSedeProgettoKey = new EnteSedeProgettoKey(1005L, 1L, 254L);
		EnteSedeProgetto enteSedeProgetto = new EnteSedeProgetto();
		enteSedeProgetto.setId(enteSedeProgettoKey);
		enteSedeProgettoService.terminazioneAssociazioneEnteSedeProgetto(enteSedeProgetto);
	}
}
