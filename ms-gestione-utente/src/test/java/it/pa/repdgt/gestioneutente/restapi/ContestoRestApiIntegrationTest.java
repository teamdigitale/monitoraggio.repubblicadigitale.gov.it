package it.pa.repdgt.gestioneutente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.gestioneutente.AppTests;
import it.pa.repdgt.gestioneutente.request.CreaContestoRequest;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.request.ProfilazioneRequest;
import it.pa.repdgt.gestioneutente.resource.ContestoResource;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class ContestoRestApiIntegrationTest extends AppTests{
	
	@Test
	void contestoRestApiTest() {
		CreaContestoRequest creaContestoRequest = new CreaContestoRequest();
		creaContestoRequest.setCodiceFiscale("UIHPLW87R49F205X");
		ContestoResource response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto", creaContestoRequest, ContestoResource.class);
		assertThat(response).isNotNull();
		creaContestoRequest.setCodiceFiscale("SMTPAL67R31F111X");
		response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto", creaContestoRequest, ContestoResource.class);
		assertThat(response).isNotNull();	
	}
	
	@Test
	void sceltaProfiloTest() {
		ProfilazioneRequest profilazioneRequest = new ProfilazioneRequest();
		profilazioneRequest.setCfUtente("UIHPLW87R49F205X");
		profilazioneRequest.setCodiceRuolo("DTD");
		restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto/sceltaProfilo", profilazioneRequest,  void.class);
	}
	
	@Test
	void confermaIntegrazioneTest() {
		CreaContestoRequest creaContestoRequest = new CreaContestoRequest();
		creaContestoRequest.setCodiceFiscale("SMTPAL67R31F111X");
		ContestoResource response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto", creaContestoRequest, ContestoResource.class);
		IntegraContestoRequest integraContestoRequest = new IntegraContestoRequest();
		integraContestoRequest.setBio("integraBio");
		integraContestoRequest.setCodiceFiscale(response.getCodiceFiscale());
		integraContestoRequest.setEmail(response.getEmail());
		integraContestoRequest.setTelefono("45352352");
		integraContestoRequest.setTipoContratto("contratto di test");
		integraContestoRequest.setAbilitazioneConsensoTrattamentoDatiPersonali(true);
		restTemplate.postForObject("http://localhost:" + randomServerPort + "/contesto/confermaIntegrazione", integraContestoRequest,  void.class);
	}
}
