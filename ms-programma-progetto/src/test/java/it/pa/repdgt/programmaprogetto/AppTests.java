package it.pa.repdgt.programmaprogetto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.programmaprogetto.restapi.ProgettoRestApi;
import it.pa.repdgt.programmaprogetto.restapi.ProgrammaRestApi;

@SpringBootTest
class AppTests {
	
	@Autowired
	private ProgrammaRestApi programmaController;
	
	@Autowired
	private ProgettoRestApi progettoController;

	@Test
	public void contextLoads() throws Exception {
		assertThat(programmaController).isNotNull();
		assertThat(progettoController).isNotNull();
	}

}
