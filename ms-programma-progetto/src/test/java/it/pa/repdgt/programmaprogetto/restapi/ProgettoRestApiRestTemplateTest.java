package it.pa.repdgt.programmaprogetto.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.ResponseEntity;

import it.pa.repdgt.programmaprogetto.AppTests;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettoRequest;
import it.pa.repdgt.programmaprogetto.resource.CreaProgettoResource;
import it.pa.repdgt.programmaprogetto.resource.ProgettiLightResourcePaginati;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class ProgettoRestApiRestTemplateTest extends AppTests{

	@Test
	void getAllProgettiPaginatiByRuolo() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		progParam.setIdProgramma(1L);
		
		ProgettiLightResourcePaginati response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/all", progParam, ProgettiLightResourcePaginati.class);
		assertThat(response.getListaProgettiLight().size()).isEqualTo(10);
	}
	
	@Test
	void getAllProgrammiDropdownPerProgettiTest() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		
		@SuppressWarnings("unchecked")
		List<ProgrammaDropdownResource> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/programmi/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(5);
	}
	
	@Test
	void getAllPoliciesDropdownByRuoloTest() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		
		@SuppressWarnings("unchecked")
		List<ProgrammaDropdownResource> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/policies/programmi/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(2);
	}
	
	@Test
	void getAllStatiDropdownByRuoloTest() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		
		@SuppressWarnings("unchecked")
		List<ProgrammaDropdownResource> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/stati/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(2);
	}
	
	@Test
	void getSchedaProgettoByIdTest() {
		SceltaProfiloParam sceltaProfilo = new SceltaProfiloParam();
		sceltaProfilo.setCfUtenteLoggato("SMTPAL67R31F111X");
		sceltaProfilo.setCodiceRuoloUtenteLoggato("DTD");
		SchedaProgettoBean response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/{idProgetto}", sceltaProfilo, SchedaProgettoBean.class, 252L);
		assertThat(response.getDettaglioProgetto().getNome()).isEqualTo("Progetto Sicurezza Informatica");
	}
	
	@Test
	void creaNuovoProgettoTest() {
		ProgettoRequest progettoRequest = new ProgettoRequest();
		progettoRequest.setNome("nuovoProgetto");
		progettoRequest.setNomeBreve("nomeBreve");
		progettoRequest.setDataInizio(new Date());
		progettoRequest.setDataFineProgetto(new Date());
		progettoRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
		progettoRequest.setCodiceRuoloUtenteLoggato("DTD");
		
		restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto?idProgramma=100", progettoRequest, CreaProgettoResource.class);
	}
	
	@Test
	@DisplayName(value = "downloadCSVSElencoProgetti - OK")
	public void downloadCSVSElencoProgettiTest() {
		
		ProgettiParam progettiParam = new ProgettiParam();
		progettiParam.setCfUtenteLoggato("UIHPLW87R49F205X");
		progettiParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		progettiParam.setFiltroRequest(new ProgettoFiltroRequest());
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/progetto/download";
		
		String elencoProgetti = restTemplate.postForObject(
				urlToCall, 
				progettiParam,
				String.class
			);
		
		String[] progettiRecord = elencoProgetti.split("\\n");
		
		assertThat(elencoProgetti).isNotNull();
		assertThat(progettiRecord.length).isEqualTo(11);
	}
}
