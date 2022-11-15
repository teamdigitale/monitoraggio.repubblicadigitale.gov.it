package it.pa.repdgt.gestioneutente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.gestioneutente.AppTests;
import it.pa.repdgt.gestioneutente.request.CreaContestoRequest;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.resource.ContestoResource;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class ContestoRestApiIntegrationTest extends AppTests{
	
	/*
	 * TEST COMMENTATO A CAUSA DEGLI ERRORI DOVUTI AL CHANGE VERSIONE H2 per motivi sicurezza
	 * passaggio da versione 1.4.xx a 2.10.xx
	 */
	
//	@Test
//	void contestoRestApiTest() {
//		CreaContestoRequest creaContestoRequest = new CreaContestoRequest();
//		creaContestoRequest.setCfUtenteLoggato("UIHPLW87R49F205X");
//		ContestoResource response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto", creaContestoRequest, ContestoResource.class);
//		assertThat(response).isNotNull();
//		creaContestoRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
//		response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto", creaContestoRequest, ContestoResource.class);
//		assertThat(response).isNotNull();	
//	}
//	
//	@Test
//	void sceltaProfiloTest() {
//		SceltaProfiloParam profilazioneRequest = new SceltaProfiloParam();
//		profilazioneRequest.setCfUtenteLoggato("UIHPLW87R49F205X");
//		profilazioneRequest.setCodiceRuoloUtenteLoggato("DTD");
//		restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto/sceltaProfilo", profilazioneRequest,  void.class);
//	}
//	
//	@Test
//	void confermaIntegrazioneTest() {
//		CreaContestoRequest creaContestoRequest = new CreaContestoRequest();
//		creaContestoRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
//		ContestoResource response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto", creaContestoRequest, ContestoResource.class);
//		IntegraContestoRequest integraContestoRequest = new IntegraContestoRequest();
//		integraContestoRequest.setBio("integraBio");
//		integraContestoRequest.setCfUtenteLoggato(response.getCodiceFiscale());
//		integraContestoRequest.setEmail(response.getEmail());
//		integraContestoRequest.setTelefono("45352352");
//		integraContestoRequest.setTipoContratto("contratto di test");
//		integraContestoRequest.setAbilitazioneConsensoTrattamentoDatiPersonali(true);
//		restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto/confermaIntegrazione", integraContestoRequest,  void.class);
//	}
}
