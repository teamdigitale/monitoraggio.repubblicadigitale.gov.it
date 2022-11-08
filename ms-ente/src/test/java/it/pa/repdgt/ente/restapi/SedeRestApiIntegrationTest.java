package it.pa.repdgt.ente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.ente.AppTests;
import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest;
import it.pa.repdgt.ente.resource.SedeResource;
import it.pa.repdgt.ente.service.IndirizzoSedeService;
import it.pa.repdgt.ente.service.SedeService;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;
import it.pa.repdgt.shared.entity.SedeEntity;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class SedeRestApiIntegrationTest extends AppTests {

	@Autowired
	private SedeService sedeService;
	@Autowired
	private IndirizzoSedeService indirizzoSedeService;
	
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
		nuovaSedeRequest.setNome("test");
		nuovaSedeRequest.setIsItinere(false);
		nuovaSedeRequest.setServiziErogati("servizio test");
		
		IndirizzoSedeRequest indirizzoSedeRequest = new IndirizzoSedeRequest();
		indirizzoSedeRequest.setVia("via test");
		indirizzoSedeRequest.setCancellato(false);
		indirizzoSedeRequest.setCap("92099");
		indirizzoSedeRequest.setCivico("11");
		indirizzoSedeRequest.setNazione("Italia");
		indirizzoSedeRequest.setProvincia("TE");
		indirizzoSedeRequest.setComune("Test");
		indirizzoSedeRequest.setRegione("Molise");
		IndirizzoSedeFasciaOrariaEntity indirizzoSedeFasciaOraria = new IndirizzoSedeFasciaOrariaEntity();
		indirizzoSedeFasciaOraria.setDomOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setDomOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setDomOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setDomOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioChiusura2("07:30");
		indirizzoSedeRequest.setFasceOrarieAperturaIndirizzoSede(indirizzoSedeFasciaOraria);
		
		List<IndirizzoSedeRequest> indirizzoSedeReqList = new ArrayList<IndirizzoSedeRequest>();
		indirizzoSedeReqList.add(indirizzoSedeRequest);
		nuovaSedeRequest.setIndirizziSedeFasceOrarie(indirizzoSedeReqList);
		
		nuovaSedeRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
		nuovaSedeRequest.setCodiceRuoloUtenteLoggato("DTD");
		
		String url = String.format("http://localhost:%s/sede", randomServerPort);
		Map<Object, Object> response = restTemplate.postForObject(url, nuovaSedeRequest, Map.class);
		
		assertThat(response).isNotNull();
		assertThat(response.get("idSedeCreata")).isNotNull();
	}
	
	@Test
	public void aggiornaSedeTest() {
		NuovaSedeRequest aggiornaSedeRequest = new NuovaSedeRequest();
		aggiornaSedeRequest.setNome("Test");
		aggiornaSedeRequest.setIsItinere(false);
		aggiornaSedeRequest.setServiziErogati("servizio test");
		
		IndirizzoSedeRequest indirizzoSedeRequest = new IndirizzoSedeRequest();
		indirizzoSedeRequest.setId(1L);
		indirizzoSedeRequest.setVia("via test");
		indirizzoSedeRequest.setCancellato(false);
		indirizzoSedeRequest.setCap("92099");
		indirizzoSedeRequest.setCivico("11");
		indirizzoSedeRequest.setNazione("Italia");
		indirizzoSedeRequest.setProvincia("TE");
		indirizzoSedeRequest.setComune("Test");
		indirizzoSedeRequest.setRegione("Molise");
		IndirizzoSedeFasciaOrariaEntity indirizzoSedeFasciaOraria = new IndirizzoSedeFasciaOrariaEntity();
		indirizzoSedeFasciaOraria.setDomOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setDomOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setDomOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setDomOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setSabOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setVenOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setGioOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setMerOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setMarOrarioChiusura2("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioAperutura1("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioAperutura2("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioChiusura1("07:30");
		indirizzoSedeFasciaOraria.setLunOrarioChiusura2("07:30");
		indirizzoSedeRequest.setFasceOrarieAperturaIndirizzoSede(indirizzoSedeFasciaOraria);
		
		
		List<IndirizzoSedeRequest> indirizzoSedeReqList = new ArrayList<IndirizzoSedeRequest>();
		indirizzoSedeReqList.add(indirizzoSedeRequest);
		aggiornaSedeRequest.setIndirizziSedeFasceOrarie(indirizzoSedeReqList);
		
		aggiornaSedeRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
		aggiornaSedeRequest.setCodiceRuoloUtenteLoggato("DTD");
		
		String url = String.format("http://localhost:%s/sede/aggiorna/1", randomServerPort);
		this.restTemplate.put(url, aggiornaSedeRequest);
		
		SedeEntity sedeFetch = this.sedeService.getSedeById(1L);
		
		assertThat(sedeFetch.getNome()).isEqualTo("Test");
		assertThat(sedeFetch.getServiziErogati()).isEqualTo("servizio test");
		
		List<IndirizzoSedeProjection> indirizzoSedeFetch = this.indirizzoSedeService.getIndirizzoSedeByIdSede(sedeFetch.getId());
		assertThat(indirizzoSedeFetch).isNotNull();
		assertThat(indirizzoSedeFetch).isNotEmpty();
		
	}
}