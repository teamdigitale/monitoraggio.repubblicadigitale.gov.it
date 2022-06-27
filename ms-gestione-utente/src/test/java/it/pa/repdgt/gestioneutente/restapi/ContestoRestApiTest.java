package it.pa.repdgt.gestioneutente.restapi;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

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

import it.pa.repdgt.gestioneutente.request.CreaContestoRequest;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.request.ProfilazioneRequest;
import it.pa.repdgt.gestioneutente.service.ContestoService;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;

@SpringBootTest
@AutoConfigureMockMvc
public class ContestoRestApiTest{

	@Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }
	
	@MockBean
	private ContestoService contestoService;
	
	@Autowired
	ObjectMapper objectMapper;
	
	@Test
	public void creaContestoTest() throws Exception {
		
		CreaContestoRequest creaContestoRequest = new CreaContestoRequest();
		creaContestoRequest.setCodiceFiscale("provaCodiceFiscale");
		
		UtenteEntity utente = new UtenteEntity();
		utente.setCodiceFiscale("provaCodiceFiscale");
		utente.setCognome("");
		utente.setEmail("a@a.com");
		utente.setNome("");
		utente.setTelefono("4554535");
		utente.setStato("ATTIVO");
		utente.setIntegrazione(true);
		
		List<RuoloEntity> ruoli = new ArrayList<>();
		RuoloEntity ruolo = new RuoloEntity();
		ruolo.setCodice("DTD");
		ruolo.setNome("");
		
		ruoli.add(ruolo);
		
		utente.setRuoli(ruoli);
		
		
	    when(this.contestoService.creaContesto("provaCodiceFiscale")).thenReturn(utente);

		this.mockMvc
		.perform(
				post("/contesto")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(creaContestoRequest))
				)
		.andDo(print())
		.andExpect(status()
				.isOk());
		
		this.mockMvc
		.perform(
				post("/contesto")
				)
		.andDo(print())
		.andExpect(status()
				.is5xxServerError());
	}
	
	@Test
	public void sceltaProfiloTest() throws Exception {
		
		ProfilazioneRequest utenteRequest = new ProfilazioneRequest();
		utenteRequest.setCfUtente("codiceFiscale");
		utenteRequest.setCodiceRuolo("DTD");	
		
		this.mockMvc
		.perform(
				post("/contesto/sceltaProfilo")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(utenteRequest))
				)
		.andDo(print())
		.andExpect(status()
				.isOk());
	}
	
	@Test
	public void confermaIntegrazioneTest() throws Exception {
		
		IntegraContestoRequest integraContestoRequestRequest = new IntegraContestoRequest();
		integraContestoRequestRequest.setCodiceFiscale("codiceFiscale");
		integraContestoRequestRequest.setCognome("cognome");
		integraContestoRequestRequest.setNome("nome");
		integraContestoRequestRequest.setTelefono("45234234");
		integraContestoRequestRequest.setBio("bio");
		integraContestoRequestRequest.setEmail("a@a.it");
		integraContestoRequestRequest.setAbilitazioneConsensoTrattamentoDatiPersonali(true);
		
		this.mockMvc
		.perform(
				post("/contesto/confermaIntegrazione")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(integraContestoRequestRequest))
				)
		.andDo(print())
		.andExpect(status()
				.isOk());
	}
}
