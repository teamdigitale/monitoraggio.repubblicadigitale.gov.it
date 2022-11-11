package it.pa.repdgt.surveymgmt.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.json.JsonObject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.App;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection.SezioneQuestionarioTemplate;
import it.pa.repdgt.surveymgmt.resource.QuestionariTemplatePaginatiResource;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateResource;
import it.pa.repdgt.surveymgmt.service.QuestionarioTemplateService;

@SpringBootTest(
	classes = App.class,
	webEnvironment=WebEnvironment.RANDOM_PORT
)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class QuestionarioTemplateRestApiTest {
	@LocalServerPort
	protected int randomServerPort;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private QuestionarioTemplateService questionarioTemplateService;
	
	@Test
	@DisplayName(value = "getAllQuestionariTemplate per DTD")
	@Order(1)
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroTest() throws Exception {
		int currPage = 0;
		int pageSize = 10;
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteDTD = "UIHPLW87R49F205X";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		profilazioneParam.setCodiceRuoloUtenteLoggato("DTD");
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/all?curPage="+currPage+"&pageSize="+pageSize;
		QuestionariTemplatePaginatiResource response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
			);

		assertThat(response.getQuestionariTemplate().size()).isEqualTo(3);
	}
	
	@Test
	@DisplayName(value = "getAllQuestionariTemplate per DSCU")
	@Order(2)
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroTest2() throws Exception {
		int currPage = 0;
		int pageSize = 10;
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteDSCU = "ASDPDS17R65F313X";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteDSCU);
		profilazioneParam.setCodiceRuoloUtenteLoggato("DSCU");
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/all?curPage="+currPage+"&pageSize="+pageSize;
		QuestionariTemplatePaginatiResource response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
			);

		assertThat(response.getQuestionariTemplate().size()).isEqualTo(1);
	}
	
	@Test
	@DisplayName(value = "getAllQuestionariTemplate per REG, DEG")
	@Order(3)
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroTest3() throws Exception {
		int currPage = 0;
		int pageSize = 10;
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteREG = "XTAAAA54E91E123Z";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteREG);
		profilazioneParam.setCodiceRuoloUtenteLoggato("REG");
		Long idProgramma = 104L;
		profilazioneParam.setIdProgramma(idProgramma);
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/all?curPage="+currPage+"&pageSize="+pageSize;
		QuestionariTemplatePaginatiResource response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
			);

		assertThat(response.getQuestionariTemplate().size()).isEqualTo(1);
		
		String codiceFiscaleUtenteDEG = "MWEDSQ99E20K123A";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteDEG);
		profilazioneParam.setCodiceRuoloUtenteLoggato("DEG");
		response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
			);

		assertThat(response.getQuestionariTemplate().size()).isEqualTo(1);
	}
	
	@Test
	@DisplayName(value = "getAllQuestionariTemplate per REGP, DEGP, REPP, DEPP, FACILITATORE, VOLONTARIO")
	@Order(4)
	public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroTest4() throws Exception {
		int currPage = 0;
		int pageSize = 10;
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteLoggato = "UTENTE2";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteLoggato);
		profilazioneParam.setCodiceRuoloUtenteLoggato("REGP");
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/all?curPage="+currPage+"&pageSize="+pageSize;
		QuestionariTemplatePaginatiResource response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
			);
		assertThat(response.getQuestionariTemplate().size()).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("DEGP");
		response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
			);
		assertThat(response.getQuestionariTemplate().size()).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("REPP");
		response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
				);
		assertThat(response.getQuestionariTemplate().size()).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("DEPP");
		response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
				);
		assertThat(response.getQuestionariTemplate().size()).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("FAC");
		response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
				);
		assertThat(response.getQuestionariTemplate().size()).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("VOL");
		response = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				QuestionariTemplatePaginatiResource.class
				);
		assertThat(response.getQuestionariTemplate().size()).isEqualTo(0);
	}
	
	@Test
	@DisplayName(value = "getAllStatiDropdwon per DTD")
	@Order(5)
	public void getAllStatiDropdownTest1() {
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteDTD = "UIHPLW87R49F205X";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		profilazioneParam.setCodiceRuoloUtenteLoggato("DTD");
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/stati/dropdown";
		 String[] stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);

		assertThat(stati.length).isEqualTo(1);
		assertThat(stati[0]).isEqualTo("ATTIVO");
	}
	
	@Test
	@DisplayName(value = "getAllStatiDropdwon per DSCU")
	@Order(6)
	public void getAllStatiDropdownTest2() throws Exception {
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteREG = "XTAAAA54E91E123Z";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteREG);
		profilazioneParam.setCodiceRuoloUtenteLoggato("REG");
		Long idProgramma = 104L;
		profilazioneParam.setIdProgramma(idProgramma);
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/stati/dropdown";
		 String[] stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);

		assertThat(stati.length).isEqualTo(1);
		assertThat(stati[0]).isEqualTo("ATTIVO");
		
		String codiceFiscaleUtenteDEG = "MWEDSQ99E20K123A";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteDEG);
		profilazioneParam.setCodiceRuoloUtenteLoggato("DEG");
		stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);

		assertThat(stati.length).isEqualTo(1);
		assertThat(stati[0]).isEqualTo("ATTIVO");
	}
	
	@Test
	@DisplayName(value = "getAllStatiDropdwon per REG, DEG")
	@Order(7)
	public void getAllStatiDropdownTest3() throws Exception {
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteDSCU = "ASDPDS17R65F313X";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteDSCU);
		profilazioneParam.setCodiceRuoloUtenteLoggato("DSCU");
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/stati/dropdown";
		 String[] stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);

		assertThat(stati.length).isEqualTo(1);
		assertThat(stati[0]).isEqualTo("ATTIVO");
	}
	
	@Test
	@DisplayName(value = "getAllStatiDropdwon per REGP, DEGP, REPP, DEPP, FACILITATORE, VOLONTARIO")
	@Order(8)
	public void getAllStatiDropdownTest4() throws Exception {
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteLoggato = "UTENTE2";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteLoggato);
		profilazioneParam.setCodiceRuoloUtenteLoggato("REGP");
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/stati/dropdown";
		String[] stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);
		assertThat(stati.length).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("DEGP");
		stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);
		assertThat(stati.length).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("REPP");
		stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);
		assertThat(stati.length).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("DEPP");
		stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);
		assertThat(stati.length).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("FAC");
		stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);
		assertThat(stati.length).isEqualTo(0);
		
		profilazioneParam.setCodiceRuoloUtenteLoggato("VOL");
		stati = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam, 
				String[].class
			);
		assertThat(stati.length).isEqualTo(0);
	}
	
	@Test
	@DisplayName(value = "getQuestioanarioTemplateByIdTest - OK")
	@Order(9)
	public void getQuestioanarioTemplateByIdTestOK() {
		QuestionarioTemplateCollection questionarioTemplateCollection = new QuestionarioTemplateCollection();
		questionarioTemplateCollection.setNomeQuestionarioTemplate("template test");
		questionarioTemplateCollection.setDescrizioneQuestionarioTemplate("descrizione test");
		questionarioTemplateCollection.setDefaultRFD(true);
		questionarioTemplateCollection.setDefaultSCD(false);
		questionarioTemplateCollection.setStato("ATTIVO");
	
		List<SezioneQuestionarioTemplate> sezioni = new ArrayList<>();
		
		SezioneQuestionarioTemplate sezione = new SezioneQuestionarioTemplate();
		sezione.setId(UUID.randomUUID().toString());
		sezione.setTitolo("Sezione test");
		sezione.setSchema(new JsonObject("{ json schema }"));
		sezione.setSchemaui(new JsonObject("{ json uiSchema }"));
		
		sezioni.add(sezione);
		questionarioTemplateCollection.setSezioniQuestionarioTemplate(sezioni);
		QuestionarioTemplateCollection result = this.questionarioTemplateService.creaNuovoQuestionarioTemplate(questionarioTemplateCollection);
		
		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		profilazioneParam.setCfUtenteLoggato("UTENTE2");
		profilazioneParam.setCodiceRuoloUtenteLoggato("DTD");
		
		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/"+result.getIdQuestionarioTemplate();
		QuestionarioTemplateResource questionarioTemplateResource = restTemplate.postForObject(
				urlToCall, 
				profilazioneParam,
				QuestionarioTemplateResource.class
			);
		
		assertThat(questionarioTemplateResource).isNotNull();
		assertThat(questionarioTemplateResource.getId()).isEqualTo(result.getIdQuestionarioTemplate());
	}
	
	@Test
	@DisplayName(value = "downloadCSVSElencoQuestionariTemplate - OK")
	@Order(10)
	public void downloadCSVSElencoQuestionariTemplateTest() {
		final String filtroCriterioRicerca = "";
		final String filtroStato = "";

		SceltaProfiloParam profilazioneParam = new SceltaProfiloParam();
		String codiceFiscaleUtenteDTD = "UIHPLW87R49F205X";
		profilazioneParam.setCfUtenteLoggato(codiceFiscaleUtenteDTD);
		profilazioneParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.getValue());

		String urlToCall = "http://localhost:" + randomServerPort +
				"/questionarioTemplate/download?criterioRicerca="+filtroCriterioRicerca+"&stato="+filtroStato;
		String elencoQuestionariTemplate = restTemplate.postForObject(
				urlToCall,
				profilazioneParam,
				String.class
			);

		assertThat(elencoQuestionariTemplate).isNotNull();
	}

//	@Test
//	@DisplayName(value = "creaQuestionarioTemplateTest - OK")
//	@Order(10)
//	public void creaQuestionarioTemplateTest() {
//		QuestionarioTemplateRequest questionarioTemplateRequest = new QuestionarioTemplateRequest();
//		questionarioTemplateRequest.setNomeQuestionarioTemplate("template test");
//		questionarioTemplateRequest.setDescrizioneQuestionarioTemplate("descrizione test");
//	
//		List<SezioneQuestionarioTemplateRequest> sezioni = new ArrayList<>();
//		
//		SezioneQuestionarioTemplateRequest sezione = new SezioneQuestionarioTemplateRequest();
//		sezione.setId(UUID.randomUUID().toString());
//		sezione.setTitolo("Sezione test");
//		sezione.setSezioneDiDefault(false);
//		sezione.setSchema(new String("{ \"a\": \"b\"}"));
//		sezione.setSchemaui(new String("{ \"a\": \"b\"}"));
//		sezioni.add(sezione);
//		questionarioTemplateRequest.setSezioniQuestionarioTemplate(sezioni);
//		
//		String urlToCall = "http://localhost:" + randomServerPort + "/questionarioTemplate";
//		QuestionarioTemplateCollection questionarioTemplateCollection = restTemplate.postForObject(
//				urlToCall, 
//				questionarioTemplateRequest,
//				QuestionarioTemplateCollection.class
//			);
//		
//		assertThat(questionarioTemplateCollection).isNotNull();
//	}
//	
//	@Test
//	@DisplayName(value = "aggiornaQuestioarioTemplateTest - OK")
//	@Order(11)
//	public void aggiornaQuestioarioTemplateTest() {
//		QuestionarioTemplateCollection questionarioTemplateCollection = new QuestionarioTemplateCollection();
//		questionarioTemplateCollection.setNomeQuestionarioTemplate("template test");
//		questionarioTemplateCollection.setDescrizioneQuestionarioTemplate("descrizione test");
//		questionarioTemplateCollection.setDefaultRFD(true);
//		questionarioTemplateCollection.setDefaultSCD(false);
//		questionarioTemplateCollection.setStato("ATTIVO");
//	
//		List<SezioneQuestionarioTemplate> sezioni = new ArrayList<>();
//		
//		SezioneQuestionarioTemplate sezione = new SezioneQuestionarioTemplate();
//		sezione.setId(UUID.randomUUID().toString());
//		sezione.setTitolo("Sezione test");
//		sezione.setSezioneDiDefault(false);
//		sezione.setSchema(new String("{ json schema }"));
//		sezione.setSchemaui(new String("{ json uiSchema }"));
//		
//		sezioni.add(sezione);
//		questionarioTemplateCollection.setSezioniQuestionarioTemplate(sezioni);
//		QuestionarioTemplateCollection result = this.questionarioTemplateService.creaNuovoQuestionarioTemplate(questionarioTemplateCollection);
//		
//		
//		QuestionarioTemplateRequest questionarioTemplateRequest = new QuestionarioTemplateRequest();
//		questionarioTemplateRequest.setNomeQuestionarioTemplate("template test update");
//		questionarioTemplateRequest.setDescrizioneQuestionarioTemplate("descrizione test");
//	
//		List<SezioneQuestionarioTemplateRequest> sezioniQuestionarioRequest = new ArrayList<>();
//		
//		SezioneQuestionarioTemplateRequest sezioneQuestionarioRequest = new SezioneQuestionarioTemplateRequest();
//		sezioneQuestionarioRequest.setId(UUID.randomUUID().toString());
//		sezioneQuestionarioRequest.setTitolo("Sezione test update");
//		sezioneQuestionarioRequest.setSezioneDiDefault(false);
//		sezioneQuestionarioRequest.setSchema(new String("{ \"a\": \"b\"}"));
//		sezioneQuestionarioRequest.setSchemaui(new String("{ \"a\": \"b\"}"));
//		sezioniQuestionarioRequest.add(sezioneQuestionarioRequest);
//		questionarioTemplateRequest.setSezioniQuestionarioTemplate(sezioniQuestionarioRequest);
//		
//		String urlToCall = "http://localhost:" + randomServerPort + "/questionarioTemplate/" + result.getIdQuestionarioTemplate();
//		restTemplate.put(urlToCall, questionarioTemplateRequest);
//		
//		QuestionarioTemplateCollection questionarioTemplateDBFetch = this.questionarioTemplateService.getQuestionarioTemplateById(result.getIdQuestionarioTemplate());
//		
//		assertThat(questionarioTemplateDBFetch).isNotNull();
//		assertThat(questionarioTemplateDBFetch.getNomeQuestionarioTemplate()).isEqualTo("template test update");
//		assertThat(questionarioTemplateDBFetch.getSezioniQuestionarioTemplate().get(0).getTitolo()).isEqualTo("Sezione test update");
//	}
}