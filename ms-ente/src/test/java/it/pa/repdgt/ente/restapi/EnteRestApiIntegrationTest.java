package it.pa.repdgt.ente.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.ente.AppTests;
import it.pa.repdgt.ente.bean.SchedaEnteBean;
import it.pa.repdgt.ente.request.FiltroRequest;
import it.pa.repdgt.ente.request.NuovoEnteRequest;
import it.pa.repdgt.ente.request.ReferenteDelegatoGestoreProgrammaRequest;
import it.pa.repdgt.ente.resource.EnteResource;
import it.pa.repdgt.ente.resource.ListaEntiPaginatiResource;
import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class EnteRestApiIntegrationTest extends AppTests {

	@Test
	public void getAllEntiPaginatiTest() {
		final String currPage = "0";
		final String pageSize = "10";
		final FiltroRequest filtroEnti = new FiltroRequest();
		final EntiPaginatiParam entiPaginatiParamBodyRequest = new EntiPaginatiParam();
		entiPaginatiParamBodyRequest.setCodiceRuolo(RuoloUtenteEnum.DTD);
		entiPaginatiParamBodyRequest.setCfUtente("UIHPLW87R49F205X");
		entiPaginatiParamBodyRequest.setFiltroRequest(filtroEnti);
		
		String url = String.format("http://localhost:%s/ente/all?currPage=%s&pageSize=%s", randomServerPort, currPage, pageSize);
		ListaEntiPaginatiResource response = restTemplate.postForObject(url, entiPaginatiParamBodyRequest, ListaEntiPaginatiResource.class);
	
		assertThat(response).isNotNull();
		assertThat(response.getNumeroPagine()).isEqualTo(1);
		assertThat(response.getNumeroTotaleElementi()).isEqualTo(7L);
		assertThat(response.getEnti().size()).isEqualTo(7L);
		
		entiPaginatiParamBodyRequest.setCodiceRuolo(RuoloUtenteEnum.DSCU);
		entiPaginatiParamBodyRequest.setCfUtente("ASDPDS17R65F313X");
		
		url = String.format("http://localhost:%s/ente/all?currPage=%s&pageSize=%s", randomServerPort, currPage, pageSize);
		response = restTemplate.postForObject(url, entiPaginatiParamBodyRequest, ListaEntiPaginatiResource.class);
	}

	@Test
	public void cercaEntiByCriterioRicercaTest() {
		final String criterioRicerca = "Reg";
		
		String url = String.format("http://localhost:%s/ente/cerca?criterioRicerca=%s", randomServerPort, criterioRicerca);
		EnteResource[] response = restTemplate.getForObject(url, EnteResource[].class);
	
		assertThat(response).isNotNull();
		assertThat(response.length).isEqualTo(6L);
	}
	
	@Test
	public void getSchedaEnteByIdTest() {
		final String idEnte = "1000";
		
		String url = String.format("http://localhost:%s/ente/%s", randomServerPort, idEnte);
		SchedaEnteBean response = restTemplate.getForObject(url, SchedaEnteBean.class);
		
		assertThat(response).isNotNull();
		assertThat(response.getDettagliEnte()).isNotNull();
		assertThat(response.getDettagliProfili()).isNotNull();
	}
	
	@Test
	public void creaNuovoEnteTest() {
		NuovoEnteRequest nuovoEnteRequest = new NuovoEnteRequest();
		nuovoEnteRequest.setNome("Test crea nuovo ente");
		nuovoEnteRequest.setNomeBreve("Test crea nuovo ente");
		nuovoEnteRequest.setPartitaIva("11004488914");
		nuovoEnteRequest.setSedeLegale("Roma");
		nuovoEnteRequest.setTipologia("Publico");
		nuovoEnteRequest.setIndirizzoPec("sedeTest@test.com");
		
		String url = String.format("http://localhost:%s/ente", randomServerPort);
		EnteEntity response = restTemplate.postForObject(url, nuovoEnteRequest, EnteEntity.class);
		
		assertThat(response).isNotNull();
		assertThat(response.getId()).isNotNull();
		assertThat(response.getNome()).isEqualTo("Test crea nuovo ente");
	}
}