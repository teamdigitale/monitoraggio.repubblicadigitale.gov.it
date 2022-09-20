package it.pa.repdgt.opendata.restapi;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.opendata.AppTests;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class OpenDataRestApiTest extends AppTests {

	@Test
	void getCountDownloadListaCSVCittadiniTest() {
		restTemplate.getForObject("http://localhost:" + randomServerPort + "/open-data/count/download", Map.class);
	}
	
	@Test
	void getPresignedListaCSVCittadiniTest() {
		restTemplate.getForObject("http://localhost:" + randomServerPort + "/open-data/presigned/download", String.class);
	}
	
	@Test
	void caricaFileCittadiniTest() {
		restTemplate.getForObject("http://localhost:" + randomServerPort + "/open-data/carica-file/cittadini", String.class);
	}
}
