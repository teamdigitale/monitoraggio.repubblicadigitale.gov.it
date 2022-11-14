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

import it.pa.repdgt.programmaprogetto.request.ProgettoRequest;
import it.pa.repdgt.programmaprogetto.request.TerminaRequest;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@SpringBootTest
@AutoConfigureMockMvc
public class ProgettoRestApiMockMvcTest {
	
	/*
	 * TEST COMMENTATO A CAUSA DEGLI ERRORI DOVUTI AL CHANGE VERSIONE H2 per motivi sicurezza
	 * passaggio da versione 1.4.xx a 2.10.xx
	 */
	
//	@Autowired
//    private WebApplicationContext wac;
//
//    private MockMvc mockMvc;
//
//    @BeforeEach
//    void setup() {
//        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
//    }
//	
//	@Autowired
//	ObjectMapper objectMapper;
//
//	@Test
//	public void aggiornaProgettoTest() throws Exception {
//		ProgettoRequest nuovoProgettoRequest = new ProgettoRequest();
//		nuovoProgettoRequest.setNome("progettoTestcrea");
//		nuovoProgettoRequest.setNomeBreve("progettoTestcrea");
//		nuovoProgettoRequest.setDataInizio(new Date());
//		nuovoProgettoRequest.setDataFineProgetto(new Date());
//		nuovoProgettoRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
//		nuovoProgettoRequest.setCodiceRuoloUtenteLoggato("DTD");
//		
//		this.mockMvc
//			.perform(
//					put("/progetto/250")
//					.contentType(MediaType.APPLICATION_JSON)
//					.content(objectMapper.writeValueAsBytes(nuovoProgettoRequest))
//					)
//			.andDo(print())
//			.andExpect(status()
//					.is2xxSuccessful());
//	}
//	
//	@Test
//	public void assegnaGestoreAlProgettoTest() throws Exception {
//		SceltaProfiloParam sceltaProfiloParam = new SceltaProfiloParam();
//		sceltaProfiloParam.setCfUtenteLoggato("SMTPAL67R31F111X");
//		sceltaProfiloParam.setCodiceRuoloUtenteLoggato("DTD");
//		this.mockMvc
//		.perform(
//				put("/progetto/250/assegna/enteGestore/1000")
//				.contentType(MediaType.APPLICATION_JSON)
//				.content(objectMapper.writeValueAsBytes(sceltaProfiloParam))
//				)
//		.andDo(print())
//		.andExpect(status()
//				.is2xxSuccessful());
//	}
//	
//	@Test
//	public void cancellazioneProgettoTest() throws Exception {
//		SceltaProfiloParam sceltaProfiloParam = new SceltaProfiloParam();
//		sceltaProfiloParam.setCfUtenteLoggato("SMTPAL67R31F111X");
//		sceltaProfiloParam.setCodiceRuoloUtenteLoggato("DTD");
//		this.mockMvc
//		.perform(
//				delete("/progetto/261")
//				.contentType(MediaType.APPLICATION_JSON)
//				.content(objectMapper.writeValueAsBytes(sceltaProfiloParam))
//				)
//		.andDo(print())
//		.andExpect(status()
//				.is2xxSuccessful());
//	}
//	
//	@Test
//	public void terminaProgettoTest() throws Exception {
//		TerminaRequest terminaRequest = new TerminaRequest();
//		terminaRequest.setDataTerminazione("15-07-2022");
//		terminaRequest.setCfUtenteLoggato("SMTPAL67R31F111X");
//		terminaRequest.setCodiceRuoloUtenteLoggato("DTD");
//		
//		this.mockMvc
//		.perform(
//				put("/progetto/termina/255")
//				.contentType(MediaType.APPLICATION_JSON)
//				.content(objectMapper.writeValueAsBytes(terminaRequest))
//				)
//		.andDo(print())
//		.andExpect(status()
//				.is2xxSuccessful());
//	}
//	
//	@Test
//	public void attivaProgettoTest() throws Exception {
//		SceltaProfiloParam sceltaProfiloParam = new SceltaProfiloParam();
//		sceltaProfiloParam.setCfUtenteLoggato("SMTPAL67R31F111X");
//		sceltaProfiloParam.setCodiceRuoloUtenteLoggato("DTD");
//		this.mockMvc
//		.perform(
//				put("/progetto/attiva/260")
//				.contentType(MediaType.APPLICATION_JSON)
//				.content(objectMapper.writeValueAsBytes(sceltaProfiloParam))
//				)
//		.andDo(print())
//		.andExpect(status()
//				.is2xxSuccessful());
//	}
}
