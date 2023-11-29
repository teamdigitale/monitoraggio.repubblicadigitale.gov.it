package it.pa.repdgt.programmaprogetto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.programmaprogetto.repository.UtenteXRuoloRepository;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

//@SpringBootTest
//@ExtendWith(MockitoExtension.class)
public class UtenteXRuoloServiceTest {

	@Mock
	private UtenteXRuoloRepository utenteXRuoloRepository;

	@Autowired
	@InjectMocks
	private UtenteXRuoloService utenteXRuoloService;

	UtenteXRuoloKey utenteXRuoloKey;

	@BeforeEach
	public void setUp() {
		utenteXRuoloKey = new UtenteXRuoloKey("SMTPAL67R31F111X", "DTD");
	}

	// @Test
	public void cancellaRuoloUtente() {
		utenteXRuoloService.cancellaRuoloUtente(utenteXRuoloKey);
	}
}
