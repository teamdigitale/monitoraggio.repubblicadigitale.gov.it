package it.pa.repdgt.surveymgmt.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.surveymgmt.App;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.resource.CittadiniPaginatiResource;

@SpringBootTest(
	classes = App.class,
	webEnvironment=WebEnvironment.RANDOM_PORT
)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CittadinoRestApiTest {
	@LocalServerPort
	protected int randomServerPort;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Test
	@DisplayName(value = "getAllCittadiniTest - OK")
	public void getAllCittadiniTest() {
		String currPage = "0", pageSize = "10";
		CittadiniPaginatiParam cittadiniParam = new CittadiniPaginatiParam();
		String codiceFiscaleUtenteDTD = "UTENTE2";
		cittadiniParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		cittadiniParam.setCodiceRuoloUtenteLoggato("FAC");
		FiltroListaCittadiniParam filtroRequest = new FiltroListaCittadiniParam();
		List<String> isdSedi = new ArrayList<>();
		isdSedi.add("1");
		filtroRequest.setIdsSedi(isdSedi);
		filtroRequest.setCriterioRicerca(null);
		cittadiniParam.setFiltro(filtroRequest);
		
		String urlToCall = "http://localhost:" + randomServerPort + "/cittadino/all"
				+ "?currPage="+currPage+"&pageSize="+pageSize;
		
		CittadiniPaginatiResource cittadiniPaginatiResouce = restTemplate.postForObject(
				urlToCall, 
				cittadiniParam,
				CittadiniPaginatiResource.class
			);
		
		assertThat(cittadiniPaginatiResouce).isNotNull();
	}
	
	@Test
	@DisplayName(value = "downloadCSVSElencoCittadiniTemplate - OK")
	public void downloadCSVSElencoCittadiniTest() {
		CittadiniPaginatiParam cittadiniParam = new CittadiniPaginatiParam();
		String codiceFiscaleUtenteDTD = "UTENTE2";
		cittadiniParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		cittadiniParam.setCodiceRuoloUtenteLoggato("FAC");
		FiltroListaCittadiniParam filtroRequest = new FiltroListaCittadiniParam();
		List<String> isdSedi = new ArrayList<>();
		isdSedi.add("1");
		filtroRequest.setIdsSedi(isdSedi);
		filtroRequest.setCriterioRicerca(null);
		cittadiniParam.setFiltro(filtroRequest);
		
		String urlToCall = "http://localhost:" + randomServerPort + "/cittadino/download";
		String elencoCittadini = restTemplate.postForObject(
				urlToCall, 
				cittadiniParam,
				String.class
			);
		
	}
}