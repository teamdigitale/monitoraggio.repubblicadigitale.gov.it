package it.pa.repdgt.gestioneutente.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.gestioneutente.repository.RuoloXGruppoRepository;

//@ExtendWith(MockitoExtension.class)
public class RuoloXGruppoServiceTest {

	@Mock
	private GruppoService gruppoService;
	@Mock
	private RuoloXGruppoRepository ruoloXGruppoRepository;

	@Autowired
	@InjectMocks
	private RuoloXGruppoService service;

	// @Test
	public void salvaNuovaAssociazioneInRuoloXGruppoTest() {
		service.salvaNuovaAssociazioneInRuoloXGruppo("codiceRuolo", "codiceGruppo");
	}
}
