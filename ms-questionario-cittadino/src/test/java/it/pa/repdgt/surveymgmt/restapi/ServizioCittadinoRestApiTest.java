package it.pa.repdgt.surveymgmt.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.surveymgmt.App;
import it.pa.repdgt.surveymgmt.request.GetCittadiniRequest;
import it.pa.repdgt.surveymgmt.resource.GetCittadinoResource;

@SpringBootTest(
	classes = App.class,
	webEnvironment=WebEnvironment.RANDOM_PORT
)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ServizioCittadinoRestApiTest {
	@LocalServerPort
	protected int randomServerPort;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Test
	public void getCittadiniTest1() {
		GetCittadiniRequest getCittadiniRequest = new GetCittadiniRequest();
		getCittadiniRequest.setCriterioRicerca("SMNCLL86P12H501A");
		getCittadiniRequest.setTipoDocumento("CF");
		
		String urlToCall = "http://localhost:" + randomServerPort + "/servizio/cittadino";
		GetCittadinoResource[] response = restTemplate.postForObject(
				urlToCall, 
				getCittadiniRequest, 
				GetCittadinoResource[].class
			);

		assertThat(response).isNotNull();
		assertThat(response.length).isEqualTo(1L);
	}
	
	@Test
	public void getCittadiniTest2() {
		GetCittadiniRequest getCittadiniRequest = new GetCittadiniRequest();
		getCittadiniRequest.setCriterioRicerca("U888XX");
		getCittadiniRequest.setTipoDocumento("NUM_DOC");
		
		String urlToCall = "http://localhost:" + randomServerPort + "/servizio/cittadino";
		GetCittadinoResource[] response = restTemplate.postForObject(
				urlToCall, 
				getCittadiniRequest, 
				GetCittadinoResource[].class
			);

		assertThat(response).isNotNull();
		assertThat(response.length).isEqualTo(1L);
	}
}