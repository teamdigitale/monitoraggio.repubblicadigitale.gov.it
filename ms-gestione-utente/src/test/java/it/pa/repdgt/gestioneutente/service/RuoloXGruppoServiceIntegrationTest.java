package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloXGruppoException;

//@SpringBootTest
public class RuoloXGruppoServiceIntegrationTest {

	@Autowired
	private RuoloXGruppoService service;

	// @Test
	public void getAssociazioneRuoloXGruppoTest() {
		Assertions.assertThrows(ResourceNotFoundException.class,
				() -> service.getAssociazioneRuoloXGruppo("codiceRuoloInesistente", "codiceGruppoInesistente"));
		assertThat(service.getAssociazioneRuoloXGruppo("DTD", "programma.write").getId().getGruppoCodice())
				.isEqualTo("programma.write");
	}

	// @Test
	public void salvaAssociazioniInRuoloXGruppoTest() {
		Assertions.assertThrows(RuoloXGruppoException.class,
				() -> service.salvaAssociazioniInRuoloXGruppo(null, new ArrayList<String>()));
		Assertions.assertThrows(RuoloXGruppoException.class,
				() -> service.salvaAssociazioniInRuoloXGruppo("codiceRuolo", null));
		List<String> gruppiString = new ArrayList<>();
		gruppiString.add("programma.write");
		service.salvaAssociazioniInRuoloXGruppo("DEG", gruppiString);
	}

	// @Test
	public void aggiornaAssociazioniRuoloGruppoTest() {
		Assertions.assertThrows(RuoloXGruppoException.class,
				() -> service.aggiornaAssociazioniRuoloGruppo(null, new ArrayList<String>()));
		Assertions.assertThrows(RuoloXGruppoException.class,
				() -> service.aggiornaAssociazioniRuoloGruppo("codiceRuolo", null));
		List<String> gruppiString = new ArrayList<>();
		gruppiString.add("ente.write");
		gruppiString.add("programma.write");
		service.aggiornaAssociazioniRuoloGruppo("DTD", gruppiString);
	}
}
