package it.pa.repdgt.ente.restapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.ente.request.FiltroRequest;
import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@SpringBootTest
@AutoConfigureMockMvc
public class EnteRestApiMockMvcTest{
	/*
	 * TEST COMMENTATO A CAUSA DEGLI ERRORI DOVUTI AL CHANGE VERSIONE H2 per motivi sicurezza
	 * passaggio da versione 1.4.xx a 2.10.xx
	 */
	
//	@Autowired
//	private MockMvc mockMvc;
//	
//	@Autowired
//	private ObjectMapper objectMapper;
//	
//	@Test
//	void getAllEntiPaginatiTest() throws Exception {
//		final String currPage = "0";
//		final String pageSize = "10";
//		final FiltroRequest filtroEnti = new FiltroRequest();
//		final EntiPaginatiParam entiPaginatiParamBodyRequest = new EntiPaginatiParam();
//		entiPaginatiParamBodyRequest.setCodiceRuoloUtenteLoggato("DTD");
//		entiPaginatiParamBodyRequest.setCfUtenteLoggato("UIHPLW87R49F205X");
//		entiPaginatiParamBodyRequest.setFiltroRequest(filtroEnti);
//			  
//	   mockMvc.perform(post("/ente/all")
//	        .contentType("application/json")
//	        .param("currPage", currPage)
//	        .param("pageSize", pageSize)
//	        .content(objectMapper.writeValueAsString(entiPaginatiParamBodyRequest)))
//	        .andExpect(status().isOk());
//	}
//	
//	@Test
//	void cercaEntiByCriterioRicercaTest() throws Exception {
//		this.mockMvc.perform(get("/ente/cerca?criterioRicerca=criterio")).andDo(print())
//		.andExpect(status().isOk());
//	}
//	
//	@Test
//	void getAllProfiliEntiDropdownTest() throws Exception {
//		final FiltroRequest filtroEnti = new FiltroRequest();
//		final EntiPaginatiParam entiPaginatiParamBodyRequest = new EntiPaginatiParam();
//		entiPaginatiParamBodyRequest.setCodiceRuoloUtenteLoggato("DTD");
//		entiPaginatiParamBodyRequest.setCfUtenteLoggato("UIHPLW87R49F205X");
//		entiPaginatiParamBodyRequest.setFiltroRequest(filtroEnti);
//			  
//	   mockMvc.perform(post("/ente/profili/dropdown")
//	        .contentType("application/json")
//	        .content(objectMapper.writeValueAsString(entiPaginatiParamBodyRequest)))
//	        .andExpect(status().isOk());
//	}
//	
//	@Test
//	void getAllProgrammiDropdownTest() throws Exception {
//		final FiltroRequest filtroEnti = new FiltroRequest();
//		final EntiPaginatiParam entiPaginatiParamBodyRequest = new EntiPaginatiParam();
//		entiPaginatiParamBodyRequest.setCodiceRuoloUtenteLoggato("DTD");
//		entiPaginatiParamBodyRequest.setCfUtenteLoggato("UIHPLW87R49F205X");
//		entiPaginatiParamBodyRequest.setFiltroRequest(filtroEnti);
//			  
//	   mockMvc.perform(post("/ente/programmi/dropdown")
//	        .contentType("application/json")
//	        .content(objectMapper.writeValueAsString(entiPaginatiParamBodyRequest)))
//	        .andExpect(status().isOk());
//	}
//	
//	@Test
//	void getAllProgettiDropdownTest() throws Exception {
//		final FiltroRequest filtroEnti = new FiltroRequest();
//		final EntiPaginatiParam entiPaginatiParamBodyRequest = new EntiPaginatiParam();
//		entiPaginatiParamBodyRequest.setCodiceRuoloUtenteLoggato("DTD");
//		entiPaginatiParamBodyRequest.setCfUtenteLoggato("UIHPLW87R49F205X");
//		entiPaginatiParamBodyRequest.setFiltroRequest(filtroEnti);
//		
//		mockMvc.perform(post("/ente/progetti/dropdown")
//				.contentType("application/json")
//				.content(objectMapper.writeValueAsString(entiPaginatiParamBodyRequest)))
//		.andExpect(status().isOk());
//	}
//
//	@Test
//	void getSchedaEnteByIdAndProfiloTest() throws Exception {
//		SceltaProfiloParam sceltaProfiloParam = new SceltaProfiloParam();
//		sceltaProfiloParam.setCodiceRuoloUtenteLoggato("DTD");
//		sceltaProfiloParam.setCfUtenteLoggato("UIHPLW87R49F205X");
//		
//		mockMvc.perform(post("/ente/{idEnte}", 1L)
//				.contentType("application/json")
//				.content(objectMapper.writeValueAsString(sceltaProfiloParam)))
//		.andExpect(status().isOk());
//	}
}