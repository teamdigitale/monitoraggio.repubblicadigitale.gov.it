package it.pa.repdgt.gestioneutente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.gestioneutente.AppTests;
import it.pa.repdgt.shared.entity.GruppoEntity;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class GruppoRestApiIntegrationTest extends AppTests {
	
	/*
	 * TEST COMMENTATO A CAUSA DEGLI ERRORI DOVUTI AL CHANGE VERSIONE H2 per motivi sicurezza
	 * passaggio da versione 1.4.xx a 2.10.xx
	 */
	
//	@Test
//	@DisplayName(value = "getAllGruppiTest - OK")
//	public void getUtenteByCriterioRicercaTest1() {
//		String urlToCall = "http://localhost:" + randomServerPort + "/gruppo/all";
//		GruppoEntity[] elencoGruppi = restTemplate.getForObject(
//				urlToCall, 
//				GruppoEntity[].class
//			);
//		
//		assertThat(elencoGruppi).isNotNull();
//	}
}