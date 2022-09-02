package it.pa.repdgt.gestioneutente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.gestioneutente.AppTests;
import it.pa.repdgt.gestioneutente.bean.SchedaRuoloBean;
import it.pa.repdgt.gestioneutente.request.RuoloRequest;
import it.pa.repdgt.shared.constants.TipologiaRuoloConstants;
import it.pa.repdgt.shared.entity.RuoloEntity;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class RuoloRestApiIntegrationTest extends AppTests {
	
	@Test
	@DisplayName(value = "getAllRuoliByTipologiaTest1 - OK")
	public void getUtenteByCriterioRicercaTest1() {
		String tipologiaRuoli = TipologiaRuoloConstants.PREDEFINITO;
		
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo?tipologiaRuoli="+tipologiaRuoli;
		RuoloEntity[] elencoRuoli = restTemplate.getForObject(
				urlToCall, 
				RuoloEntity[].class
			);
		
		assertThat(elencoRuoli).isNotNull();
	}
	
	@Test
	@DisplayName(value = "cancellazioneRuoloTest- OK")
	public void cancellazioneRuoloTest() {
		String codiceRuolo = "CUSTOM ROLE";
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo/"+ codiceRuolo;
		restTemplate.delete(
				urlToCall, 
				null,
				null
			);
	}
	
	@Test
	@DisplayName(value = "getAllRuoliByTipologiaTest2 - OK")
	public void getUtenteByCriterioRicercaTest() {
		String tipologiaRuoli = TipologiaRuoloConstants.NON_PREDEFINITO;
		
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo?tipologiaRuoli="+tipologiaRuoli;
		RuoloEntity[] elencoRuoli = restTemplate.getForObject(
				urlToCall, 
				RuoloEntity[].class
			);
		
		assertThat(elencoRuoli).isNotNull();
	}
	
	@Test
	@DisplayName(value = "getRuoliByFiltroNomeRuoloTest1 - OK")
	public void getRuoliByFiltroNomeRuoloTest1() {
		final String filtroNomeRuolo = "DTD";
		
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo/all?filfiltroNomeRuolo?"+filtroNomeRuolo;
		RuoloEntity[] elencoRuoli = restTemplate.getForObject(
				urlToCall, 
				RuoloEntity[].class
			);
		
		assertThat(elencoRuoli).isNotNull();
	}
	
	@Test
	@DisplayName(value = "getRuoliByFiltroNomeRuoloTest2 - OK")
	public void getRuoliByFiltroNomeRuoloTest2() {
		final String filtroNomeRuolo = null;
		
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo/all?filfiltroNomeRuolo?"+filtroNomeRuolo;
		RuoloEntity[] elencoRuoli = restTemplate.getForObject(
				urlToCall, 
				RuoloEntity[].class
			);
		
		assertThat(elencoRuoli).isNotNull();
	}
	
	@Test
	@DisplayName(value = "creaNuovoRuoloTest - OK")
	public void creaNuovoRuoloTest() {
		final RuoloRequest nuovoRuoloRequest = new RuoloRequest();
		nuovoRuoloRequest.setNomeRuolo("NUOVO_RUOLO_CUSTOM");
		List<String> codiciGruppo = new ArrayList<>();
		codiciGruppo.add("programma.view");
		codiciGruppo.add("programma.vrite");
		nuovoRuoloRequest.setCodiciGruppi(codiciGruppo);
		
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo";
		restTemplate.postForObject(
				urlToCall, 
				nuovoRuoloRequest,
				RuoloEntity[].class
			);
	}
	
	@Test
	@DisplayName(value = "getSchedaRuoloTest - OK")
	public void getSchedaRuoloTest() {
		final String codiceRuolo = "DTD";
		
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo/"+codiceRuolo;
		SchedaRuoloBean schedaRuoloBean = restTemplate.getForObject(
				urlToCall, 
				SchedaRuoloBean.class
			);
		
		assertThat(schedaRuoloBean).isNotNull();
	}
	
	@Test
	@DisplayName(value = "aggiornaRuoloTest - OK")
	public void aggiornaRuoloTest() {
		final String codiceRuolo = "DTD";
		
		final RuoloRequest aggiornaRuoloRequest = new RuoloRequest();
		aggiornaRuoloRequest.setNomeRuolo("DTD UPDATE");
		List<String> codiciGruppo = new ArrayList<>();
		codiciGruppo.add("programma.view");
		codiciGruppo.add("programma.vrite");
		aggiornaRuoloRequest.setCodiciGruppi(codiciGruppo);
		
		String urlToCall = "http://localhost:" + randomServerPort + "/ruolo/"+codiceRuolo;
		restTemplate.put(
				urlToCall,
				aggiornaRuoloRequest
			);
	}
}