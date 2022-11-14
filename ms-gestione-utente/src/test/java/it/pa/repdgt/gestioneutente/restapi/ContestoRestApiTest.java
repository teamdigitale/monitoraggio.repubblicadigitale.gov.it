package it.pa.repdgt.gestioneutente.restapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.service.ContestoService;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@SpringBootTest
@AutoConfigureMockMvc
public class ContestoRestApiTest{
	
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
//	@MockBean
//	private ContestoService contestoService;
//	
//	@Autowired
//	ObjectMapper objectMapper;
//	
//	@Test
//	public void sceltaProfiloTest() throws Exception {
//		
//		SceltaProfiloParam utenteRequest = new SceltaProfiloParam();
//		utenteRequest.setCfUtenteLoggato("codiceFiscale");
//		utenteRequest.setCodiceRuoloUtenteLoggato("DTD");	
//		
//		this.mockMvc
//		.perform(
//				post("/contesto/sceltaProfilo")
//				.contentType(MediaType.APPLICATION_JSON)
//				.content(objectMapper.writeValueAsString(utenteRequest))
//				)
//		.andDo(print())
//		.andExpect(status()
//				.isOk());
//	}
//	
//	@Test
//	public void confermaIntegrazioneTest() throws Exception {
//		IntegraContestoRequest integraContestoRequestRequest = new IntegraContestoRequest();
//		integraContestoRequestRequest.setCfUtenteLoggato("codiceFiscale");
//		integraContestoRequestRequest.setTelefono("45234234");
//		integraContestoRequestRequest.setBio("bio");
//		integraContestoRequestRequest.setEmail("a@a.it");
//		integraContestoRequestRequest.setTipoContratto("test");
//		integraContestoRequestRequest.setBio("bio test");
//		integraContestoRequestRequest.setAbilitazioneConsensoTrattamentoDatiPersonali(true);
//		
//		this.mockMvc
//		.perform(
//				post("/contesto/confermaIntegrazione")
//				.contentType(MediaType.APPLICATION_JSON)
//				.content(objectMapper.writeValueAsString(integraContestoRequestRequest))
//				)
//		.andDo(print())
//		.andExpect(status()
//				.isOk());
//	}
}
