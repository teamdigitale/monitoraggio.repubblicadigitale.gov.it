package it.pa.repdgt.gestioneutente;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.gestioneutente.request.CreaContestoRequest;
import it.pa.repdgt.gestioneutente.resource.ContestoResource;
import it.pa.repdgt.gestioneutente.restapi.ContestoRestApi;
import it.pa.repdgt.gestioneutente.restapi.RuoloRestApi;
import it.pa.repdgt.gestioneutente.restapi.UtenteRestApi;

//@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class AppTests {

	@LocalServerPort
	protected int randomServerPort;

	@Autowired
	protected RestTemplate restTemplate;

	@Autowired
	ContestoRestApi contestoController;
	@Autowired
	RuoloRestApi ruoloController;
	@Autowired
	UtenteRestApi utenteController;

	/*
	 * @Test
	 * void contextLoads() {
	 * assertThat(contestoController).isNotNull();
	 * assertThat(ruoloController).isNotNull();
	 * assertThat(utenteController).isNotNull();
	 * }
	 */

}
