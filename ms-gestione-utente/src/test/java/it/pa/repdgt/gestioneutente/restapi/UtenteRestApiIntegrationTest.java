package it.pa.repdgt.gestioneutente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.gestioneutente.AppTests;
import it.pa.repdgt.gestioneutente.bean.SchedaUtenteBean;
import it.pa.repdgt.gestioneutente.request.AggiornaUtenteRequest;
import it.pa.repdgt.gestioneutente.request.FiltroRequest;
import it.pa.repdgt.gestioneutente.request.NuovoUtenteRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.gestioneutente.resource.UtenteResource;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class UtenteRestApiIntegrationTest extends AppTests{
	
	@Test
	@DisplayName(value = "getUtenteByCriterioRicercaTest - OK")
	public void getUtenteByCriterioRicercaTest() {
		String criterioRicerca = "A";
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/cerca/"+criterioRicerca;
		UtenteEntity[] elencoUtenti = restTemplate.getForObject(
				urlToCall, 
				UtenteEntity[].class
			);
		
		assertThat(elencoUtenti).isNotNull();
	}
	
	@Test
	@DisplayName(value = "creaNuovoUtenteTest - OK")
	public void creaNuovoUtenteTEst() {
		NuovoUtenteRequest nuovoUtenteRequest = new NuovoUtenteRequest();
		nuovoUtenteRequest.setCodiceFiscale("PPATTR99Q99E111X");
		nuovoUtenteRequest.setNome("Luis");
		nuovoUtenteRequest.setCognome("Figo");
		nuovoUtenteRequest.setRuolo("DTD");
		nuovoUtenteRequest.setEmail("luis1.figo@email.it");
		nuovoUtenteRequest.setTelefono("3335559988");
		nuovoUtenteRequest.setMansione("mansione");
		nuovoUtenteRequest.setTipoContratto("tipo contratto");
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente";
		UtenteResource utenteCreato = restTemplate.postForObject(
				urlToCall, 
				nuovoUtenteRequest,
				UtenteResource.class
			);
		
		assertThat(utenteCreato).isNotNull();
	}
	
	@Test
	@DisplayName(value = "cancellaUtenteTest - OK")
	public void cancellaUtenteTest() {
		long idUtente = 99;
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/"+idUtente;
		restTemplate.delete(urlToCall, null, null);
	}
		
	@Test
	@DisplayName(value = "aggiornaUtenteTest - OK")
	public void aggiornaUtenteTEst() {
		final String idUtente = "1";
		
		AggiornaUtenteRequest aggiornaUtenteRequest = new AggiornaUtenteRequest();
		aggiornaUtenteRequest.setNome("Luis");
		aggiornaUtenteRequest.setCognome("Figo");
		aggiornaUtenteRequest.setEmail("luis.figo@email.it");
		aggiornaUtenteRequest.setTelefono("3335559988");
		aggiornaUtenteRequest.setMansione("mansione");
		aggiornaUtenteRequest.setTipoContratto("tipo contratto");
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/"+idUtente;
		restTemplate.put(
				urlToCall, 
				aggiornaUtenteRequest, 
				idUtente
			);
	}
	
	@Test
	@DisplayName(value = "assegnaRuoloAUtenteTest - OK")
	public void assegnaRuoloAUtenteTest() {
		String idUtente = "2";
		String codiceRuolo = "DSCU";
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/"+idUtente+"/assegnaRuolo/"+codiceRuolo;
		restTemplate.put(urlToCall, null);
	}

	@Test
	@DisplayName(value = "cancellaRuoloDaUtenteTest - OK")
	public void cancellaRuoloDaUtenteTest() {
		String idUtente = "1";
		String codiceRuolo = "DTD";
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/"+idUtente+"/cancellaRuolo/"+codiceRuolo;
		restTemplate.delete(urlToCall);
	}
		
	@Test
	@DisplayName(value = "downloadCSVUtenti - OK")
	public void downloadCSVSElencoUtentiTest() {
		UtenteRequest utenteParam = new UtenteRequest();
		String codiceFiscaleUtenteDTD = "UIHPLW87R49F205X";
		utenteParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		utenteParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		FiltroRequest filtroRequest = new FiltroRequest();
		utenteParam.setFiltroRequest(filtroRequest);
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/download";
		String elencoUtenti = restTemplate.postForObject(
				urlToCall, 
				utenteParam,
				String.class
			);
		
		assertThat(elencoUtenti).isNotNull();
	}
		
	@Test
	@DisplayName(value = "getAllStatiDropdownTest - OK")
	public void getAllStatiDropdownTest() {
		UtenteRequest utenteParam = new UtenteRequest();
		String codiceFiscaleUtenteDTD = "UIHPLW87R49F205X";
		utenteParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		utenteParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		FiltroRequest filtroRequest = new FiltroRequest();
		utenteParam.setFiltroRequest(filtroRequest);
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/stati/dropdown";
		String elencoUtenti = restTemplate.postForObject(
				urlToCall, 
				utenteParam,
				String.class
			);
		
		assertThat(elencoUtenti).isNotNull();
	}
		
	@Test
	@DisplayName(value = "getAllRuoliDropdownTest - OK")
	public void getAllRuoliDropdownTest() {
		UtenteRequest utenteParam = new UtenteRequest();
		String codiceFiscaleUtenteDTD = "UIHPLW87R49F205X";
		utenteParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		utenteParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		FiltroRequest filtroRequest = new FiltroRequest();
		utenteParam.setFiltroRequest(filtroRequest);
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/ruoli/dropdown";
		String elencoUtenti = restTemplate.postForObject(
				urlToCall, 
				utenteParam,
				String.class
			);
		
		assertThat(elencoUtenti).isNotNull();
	}
		
	@Test
	@DisplayName(value = "getSchedaUtenteByIdUtenteTest - OK")
	public void getSchedaUtenteByIdUtenteTest() {
		String idUtente = "1";
		SceltaProfiloParam profilazioneRequest = new SceltaProfiloParam();
		profilazioneRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
		profilazioneRequest.setCodiceRuoloUtenteLoggato("DTD");
		
		String urlToCall = "http://localhost:" + randomServerPort + "/utente/"+idUtente;
		SchedaUtenteBean schedaUtenteBean = restTemplate.postForObject(
				urlToCall, 
				profilazioneRequest,
				SchedaUtenteBean.class
			);
		
		assertThat(schedaUtenteBean).isNotNull();
	}
}