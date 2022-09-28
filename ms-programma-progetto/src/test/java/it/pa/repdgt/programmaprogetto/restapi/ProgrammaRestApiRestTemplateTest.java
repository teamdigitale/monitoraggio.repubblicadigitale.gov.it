package it.pa.repdgt.programmaprogetto.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.ResponseEntity;

import it.pa.repdgt.programmaprogetto.AppTests;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgrammaBean;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammaRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.resource.CreaProgrammaResource;
import it.pa.repdgt.programmaprogetto.resource.ProgrammiLightResourcePaginata;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;

@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class ProgrammaRestApiRestTemplateTest extends AppTests{
	
	@Test
	@Order(value = 0)
	void getAllProgrammiPaginatiByRuoloTest() {
		ProgrammiParam progParam = new ProgrammiParam();
		progParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(new FiltroRequest());
		progParam.setIdProgramma(1L);
		
		ProgrammiLightResourcePaginata response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/programma/all", progParam, ProgrammiLightResourcePaginata.class);
		assertThat(response.getListaProgrammiLight().size()).isEqualTo(6);
	}
	
	@Test
	@Order(value = 1)
	void getAllPoliciesDropdownByRuoloTest() {
		ProgrammiParam progParam = new ProgrammiParam();
		progParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(new FiltroRequest());
		progParam.setIdProgramma(1L);
		
		@SuppressWarnings("unchecked")
		List<String> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/programma/policies/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(2);
	}
	
	@Test
	@Order(value = 2)
	void getAllStatiDropdownByRuoloTest() {
		ProgrammiParam progParam = new ProgrammiParam();
		progParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		progParam.setCodiceRuoloUtenteLoggato("DTD");
		progParam.setFiltroRequest(new FiltroRequest());
		progParam.setIdProgramma(1L);
		
		@SuppressWarnings("unchecked")
		List<String> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/programma/stati/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(2);
	}
	
	@Test
	@Order(value = 3)
	void getSchedaProgrammaByIdTest() {
		ResponseEntity<SchedaProgrammaBean> response = restTemplate.getForEntity("http://localhost:" + randomServerPort + "/programma/{idProgramma}", SchedaProgrammaBean.class, 100L);
		assertThat(response.getBody().getDettaglioProgramma().getNome()).isEqualTo("Programma Alfa");
	}
	
	@Test
	@Order(value = 4)
	void creaNuovoProgrammaTest() {
		ProgrammaRequest programmaRequest = new ProgrammaRequest();
		programmaRequest.setNome("nuovoProgramma");
		programmaRequest.setNomeBreve("nomeBreve");
		programmaRequest.setPolicy(PolicyEnum.RFD);
		programmaRequest.setDataInizio(new Date());
		programmaRequest.setDataFine(new Date());
		programmaRequest.setCodice("codice");
		
		restTemplate.postForEntity("http://localhost:" + randomServerPort + "/programma", programmaRequest, CreaProgrammaResource.class);
	}
	
	@Test
	@Order(value = 5)
	public void downloadCSVSElencoProgrammiTest() {
		
		ProgrammiParam programmiParam = new ProgrammiParam();
		programmiParam.setCfUtenteLoggato("UIHPLW87R49F205X");
		programmiParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		programmiParam.setFiltroRequest(new FiltroRequest());
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/programma/download";
		
		String elencoProgrammi = restTemplate.postForObject(
				urlToCall, 
				programmiParam,
				String.class
			);
		
		String[] programmiRecord = elencoProgrammi.split("\\n");
		
		assertThat(programmiRecord).isNotNull();
		assertThat(programmiRecord.length).isEqualTo(8);
	}
}
