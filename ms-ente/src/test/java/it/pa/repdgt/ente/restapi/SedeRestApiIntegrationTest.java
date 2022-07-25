package it.pa.repdgt.ente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.ente.AppTests;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.ente.resource.SedeResource;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class SedeRestApiIntegrationTest extends AppTests {

	@Test
	public void cercaSedeByNomeSedeTest() {
		final String criterioRicercaSede = "se";
		
		String url = String.format("http://localhost:%s/sede/cerca/%s", randomServerPort, criterioRicercaSede);
		SedeResource[] response = restTemplate.getForObject(url, SedeResource[].class);
	
		assertThat(response).isNotNull();
		assertThat(response.length).isEqualTo(4);
	}
	
	@Test
	public void getSchedaAnagraficaSedeTest() {
		final String idSede = "2";
		
		String url = String.format("http://localhost:%s/sede/light/%s", randomServerPort, idSede);
		Map<Object, Object> response = restTemplate.getForObject(url, Map.class);
	
		assertThat(response).isNotNull();
		assertThat(response.get("dettaglioSede")).isNotNull();
	}
	
	@Test
	public void creaNuovaSedeTest() {
		NuovaSedeRequest nuovaSedeRequest = new NuovaSedeRequest();
		// TODO
	}
	
}