package it.pa.repdgt.programmaprogetto;

import static org.assertj.core.api.Assertions.assertThat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.programmaprogetto.restapi.ProgettoRestApi;
import it.pa.repdgt.programmaprogetto.restapi.ProgrammaRestApi;

//@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class AppTests {

	@LocalServerPort
	protected int randomServerPort;

	@Autowired
	protected RestTemplate restTemplate;

	@Autowired
	private ProgrammaRestApi programmaController;

	@Autowired
	private ProgettoRestApi progettoController;

	// @Test
	public void contextLoads() throws Exception {
		assertThat(programmaController).isNotNull();
		assertThat(progettoController).isNotNull();
	}

}
