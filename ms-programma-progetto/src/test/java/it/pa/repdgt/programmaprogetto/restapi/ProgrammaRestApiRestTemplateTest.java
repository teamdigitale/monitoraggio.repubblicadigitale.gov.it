package it.pa.repdgt.programmaprogetto.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import it.pa.repdgt.programmaprogetto.AppTests;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.resource.ProgrammiLightResourcePaginata;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class ProgrammaRestApiRestTemplateTest extends AppTests{
	
	@Test
	void getAllProgrammiPaginatiByRuoloTest() {
		ProgrammiParam progParam = new ProgrammiParam();
		progParam.setCfUtente("SMTPAL67R31F111X");
		progParam.setCodiceRuolo("DTD");
		progParam.setFiltroRequest(new FiltroRequest());
		progParam.setIdProgramma(1L);
		
		ProgrammiLightResourcePaginata response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/programma/all", progParam, ProgrammiLightResourcePaginata.class);
		assertThat(response.getListaProgrammiLight().size()).isEqualTo(6);
	}
}
