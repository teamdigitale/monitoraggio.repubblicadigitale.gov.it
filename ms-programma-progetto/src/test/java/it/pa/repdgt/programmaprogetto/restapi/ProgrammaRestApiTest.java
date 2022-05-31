package it.pa.repdgt.programmaprogetto.restapi;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.programmaprogetto.App;
import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaLightResource;
import it.pa.repdgt.programmaprogetto.resource.ProgrammiLightResourcePaginata;
import it.pa.repdgt.programmaprogetto.service.ProgrammaService;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@SpringBootTest
//@AutoConfigureMockMvc
@ContextConfiguration(classes = App.class)
public class ProgrammaRestApiTest{

	@Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }
	
	@MockBean
	private ProgrammaService programmaService;
	
	@Autowired
	ObjectMapper objectMapper;

	@Test
	public void getAllProgrammiPaginatiByRuoloTest() throws Exception {
		
		ProgrammiParam progParam = new ProgrammiParam();
		progParam.setCfUtente("skfhdskjfhakjh");
		progParam.setCodiceRuolo("ruolo");
		progParam.setFiltroRequest(new FiltroRequest());
		progParam.setIdProgramma(1L);

		
//		ProgrammaEntity entityRes = new ProgrammaEntity();
//		entityRes.setId(1L);
//		List<ProgrammaEntity> programmiUtente = new ArrayList<>();
//		programmiUtente.add(entityRes);
//		
//		Pageable paginazione = PageRequest.of(0, 10);
//		programmiUtente.sort((programma1, programma2) -> programma1.getId().compareTo(programma2.getId()));
//		int start = (int) paginazione.getOffset();
//		int end = Math.min((start + paginazione.getPageSize()), programmiUtente.size());
//		if(start > end) {
//			throw new ProgrammaException("ERRORE: pagina richiesta inesistente");
//		}	
//		Page<ProgrammaEntity> paginaProgrammi = new PageImpl<ProgrammaEntity>(programmiUtente.subList(start, end), paginazione, programmiUtente.size());
//		
//	    when(this.programmaService.getAllProgrammiPaginati(progParam, 0, 10, progParam.getFiltroRequest())).thenReturn(paginaProgrammi);
//
//		ProgrammiLightResourcePaginata listaPaginataProgrammiResource = new ProgrammiLightResourcePaginata();
//		listaPaginataProgrammiResource.setNumeroPagine(1);
//		listaPaginataProgrammiResource.setListaProgrammiLight(new ArrayList<ProgrammaLightResource>());
//		MvcResult mvcResult = 
				this.mockMvc
		.perform(
				post("/programma/all")
				.param("currPage", "0")
				.param("pageSize", "10")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(progParam))
				)
		.andDo(print())
		.andExpect(status()
				.isOk())
//		.andReturn()
		;
		
//		String actualResponseBody = mvcResult.getResponse().getContentAsString();
//		assertThat(actualResponseBody).isEqualToIgnoringWhitespace(
//	              objectMapper.writeValueAsString(objectMapper.writeValueAsString(listaPaginataProgrammiResource)));

//		this.mockMvc
//		.perform(
//				post("/programma/all")
//				.param("currPage", "0")
//				.param("pageSize", "10")
//				)
//		.andDo(print())
//		.andExpect(status()
//				.is4xxClientError());
	}
	
//	@Test
//	public void getAllStatiDropdownByRuoloTest() throws Exception {
//	}
}
