package it.pa.repdgt.programmaprogetto.restapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.programmaprogetto.request.ProgrammaRequest;
import it.pa.repdgt.programmaprogetto.request.TerminaRequest;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@SpringBootTest
@AutoConfigureMockMvc
public class ProgrammaRestApiMockMvcTest{

	@Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }
	
	@Autowired
	ObjectMapper objectMapper;
	
	@Test
	public void aggiornaProgrammaTest() throws Exception {
		ProgrammaRequest nuovoProgrammaRequest = new ProgrammaRequest();
		nuovoProgrammaRequest.setCup("3453454");
		nuovoProgrammaRequest.setDataFine(new Date());
		nuovoProgrammaRequest.setDataInizio(new Date());
		nuovoProgrammaRequest.setNome("programmaTestcrea");
		nuovoProgrammaRequest.setNomeBreve("programmaTestcrea");
		nuovoProgrammaRequest.setPolicy(PolicyEnum.RFD);
		nuovoProgrammaRequest.setCodice("codice");
		nuovoProgrammaRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
		nuovoProgrammaRequest.setCodiceRuoloUtenteLoggato("DTD");
		
		this.mockMvc
			.perform(
					put("/programma/100")
					.contentType(MediaType.APPLICATION_JSON)
					.content(objectMapper.writeValueAsBytes(nuovoProgrammaRequest))
					)
			.andDo(print())
			.andExpect(status()
					.is2xxSuccessful());
	}
	
	@Test
	public void assegnaEnteGestoreProgrammaAlProgrammaTest() throws Exception {
		SceltaProfiloParam sceltaProfiloParam = new SceltaProfiloParam();
		sceltaProfiloParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato("DTD");
		this.mockMvc
			.perform(
					put("/programma/100/assegna/entegestore/1002")
					.contentType(MediaType.APPLICATION_JSON)
					.content(objectMapper.writeValueAsBytes(sceltaProfiloParam))
					)
			.andDo(print())
			.andExpect(status()
					.is2xxSuccessful());
	}
	
	@Test
	public void associaQuestionarioTemplateAProgrammaTest() throws Exception {
		SceltaProfiloParam sceltaProfiloParam = new SceltaProfiloParam();
		sceltaProfiloParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato("DTD");
		this.mockMvc
			.perform(
					put("/programma/100/aggiungi/1")
					.contentType(MediaType.APPLICATION_JSON)
					.content(objectMapper.writeValueAsBytes(sceltaProfiloParam))
					)
			.andDo(print())
			.andExpect(status()
					.is2xxSuccessful());
	}
	
	@Test
	public void terminaProgrammaTest() throws Exception {
		TerminaRequest terminaRequest = new TerminaRequest();
		terminaRequest.setDataTerminazione("12-03-2022");
		terminaRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
		terminaRequest.setCodiceRuoloUtenteLoggato("DTD");
		
		this.mockMvc
			.perform(
					put("/programma/termina/102")
					.contentType(MediaType.APPLICATION_JSON)
					.content(objectMapper.writeValueAsBytes(terminaRequest))
					)
			.andDo(print())
			.andExpect(status()
					.is2xxSuccessful());
	}
	
	@Test
	public void cancellazioneProgrammaTest() throws Exception {
		SceltaProfiloParam sceltaProfiloParam = new SceltaProfiloParam();
		sceltaProfiloParam.setCfUtenteLoggato("SMTPAL67R31F111X");
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato("DTD");
		this.mockMvc
			.perform(
					delete("/programma/105")
					.contentType(MediaType.APPLICATION_JSON)
					.content(objectMapper.writeValueAsBytes(sceltaProfiloParam))
					)
			.andDo(print())
			.andExpect(status()
					.is2xxSuccessful());
	}
}
