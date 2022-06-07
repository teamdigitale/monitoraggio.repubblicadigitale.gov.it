package it.pa.repdgt.programmaprogetto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.programmaprogetto.restapi.ProgettoRestApi;
import it.pa.repdgt.programmaprogetto.restapi.ProgrammaRestApi;

@SpringBootTest
public class AppTests {
	
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
