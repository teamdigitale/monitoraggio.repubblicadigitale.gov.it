package it.pa.repdgt.surveymgmt.restapi;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiParam;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.mapper.QuestionarioTemplateMapper;
import it.pa.repdgt.surveymgmt.param.FiltroListaQuestionariTemplateParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.request.QuestionarioTemplateRequest;
import it.pa.repdgt.surveymgmt.resource.QuestionariTemplatePaginatiResource;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateLightResource;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateResource;
import it.pa.repdgt.surveymgmt.response.Response;
import it.pa.repdgt.surveymgmt.service.QuestionarioTemplateService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path = "questionarioTemplate")
@Validated
@Slf4j
public class QuestionarioTemplateRestApi {
	private static final String BASE_PATH = "questionarioTemplate";

	@Autowired
	private QuestionarioTemplateMapper questionarioTemplateMapper;
	@Autowired
	private QuestionarioTemplateService questionarioTemplateService;
	
	/***
	 * Restituisce tutti i TemplateQuestionario paginati persistiti su database MongoDb 
	 * 
	 * */
	// TOUCH POINT - 1.5.1 - Lista questionari paginata
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public QuestionariTemplatePaginatiResource getAllQuestionariTemplatate(
			@RequestBody @Valid final ProfilazioneParam profilazioneParam,
			@RequestParam(name = "criterioRicerca", required = false) final String criterioRicerca,
			@RequestParam(name = "stato", required = false) final StatoQuestionarioEnum statoQuestionario,
			@RequestParam(name = "currPage", defaultValue = "0")  @Pattern(regexp = "[0-9]+") final String currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") @Pattern(regexp = "[0-9]+") final String pageSize) {
		log.info("===> GET {} - START", BASE_PATH);
		final Pageable pagina = PageRequest.of(Integer.parseInt(currPage), Integer.parseInt(pageSize));
		final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplateParam = new FiltroListaQuestionariTemplateParam();
		filtroListaQuestionariTemplateParam.setCriterioRicerca(criterioRicerca);
		filtroListaQuestionariTemplateParam.setStatoQuestionario(statoQuestionario);
		
		final Page<QuestionarioTemplateCollection> paginaQuestionariTemplate = this.questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltro(
				profilazioneParam,
				filtroListaQuestionariTemplateParam,
				pagina
			);
		
		final List<QuestionarioTemplateLightResource> questionariTemplateLightResource = this.questionarioTemplateMapper.toLightResourceFrom(paginaQuestionariTemplate.getContent());
		final QuestionariTemplatePaginatiResource questionariTemplatePaginatiResource = new QuestionariTemplatePaginatiResource();
		questionariTemplatePaginatiResource.setQuestionariTemplate(questionariTemplateLightResource);
		questionariTemplatePaginatiResource.setNumeroPagine(paginaQuestionariTemplate.getTotalPages());
		return questionariTemplatePaginatiResource;
	}
	
	/***
	 * Restituisce il TemplateQuestionario con specifico id persistito su mongoDB
	 * 
	 * */
	// TOUCH POINT - 2.1.4 - Visualizza scheda questionario 
	// TOUCH POINT - 6.1 -   Visualizza scheda questionario
	@GetMapping(path = "/{templateQuestionarioId}",  produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public QuestionarioTemplateResource getQuestioanarioTemplateById(
			@PathVariable(value = "templateQuestionarioId") final String templateQuestionarioId) {
		log.info("===> GET {}/{}", BASE_PATH, templateQuestionarioId);
		final QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateService.getQuestionarioTemplateById(templateQuestionarioId.trim());
		return questionarioTemplateMapper.toResourceFrom(questionarioTemplate);
	}
	
	// TOUCH POINT - 1.5.4 - Crea Questionario template
	// TOUCH POINT - 6.2 -   Crea Questionario template
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void creaQuestionarioTemplate(
			@ApiParam(name = "Crea Questionario", value = "Json contenente i dati del questionario", required = true)
			@RequestBody @Valid final QuestionarioTemplateRequest nuovoTemplateQuestionarioRequest,
			@RequestParam(value = "stato") final StatoQuestionarioEnum statoQuestionarioEnum) {
		log.info("===> POST {}", BASE_PATH);
		final QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateMapper.toCollectionFrom(nuovoTemplateQuestionarioRequest);
		this.questionarioTemplateService.creaNuovoQuestionarioTemplate(questionarioTemplate, statoQuestionarioEnum);
	}
	
	// TOUCH POINT - TBD - duplica questionario template
	@GetMapping(path = "{questionarioTemplateId}/duplica", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void duplicaQuestionarioTemplate(
			@PathVariable(value = "questionarioTemplateId") final String questionatioTemplateId) {
		log.info("===> POST {}", BASE_PATH);
		this.questionarioTemplateService.duplicaQuestionarioTemplate(questionatioTemplateId);
	}
	
	/**
	 * Modifica un TemplateQuestionario con nuovo schema e nuovo uischema (nuovo uischema non required)
	 * 
	 * */
	@PutMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<QuestionarioTemplateResource>  aggiornaQuestioarioTemplate(
			@ApiParam(name = "id", value = "id template questionario da aggiornare", required = true)
			@PathVariable(value = "id") @NotBlank final String templateQuestId,
			@ApiParam(name = "oggetto con schema e uischemaa", value = "json schema e uischema template questionario da aggiornare" ,required = true)
			@NotNull @RequestBody @Valid final QuestionarioTemplateRequest aggiornaTemplateQuestionarioRequest,
			BindingResult bindingResult ) {
		log.info("===> POST {}/{}", BASE_PATH, templateQuestId);
//		final QuestionarioTemplateCollection questionarioTemplateAggiornato = this.questionarioTemplateService.aggiornaQuestionarioTemplate(
//			templateQuestId, 
//			aggiornaTemplateQuestionarioRequest.getSchemaQuestionarioTemplate(),
//			aggiornaTemplateQuestionarioRequest.getUiSchemaQuestionarioTemplate()
//		);
//		final QuestionarioTemplateResource templateQuestResource = questionarioTemplateMapper.toResourceFrom(questionarioTemplateAggiornato);
//		return new Response<>(HttpStatus.CREATED, templateQuestResource);
		return null;
	}

	/**
	 * Upload json file per lo schema del template tramite file codificato in Base64
	 * 
	 * */
	@PostMapping(path = "/upload")
	public Response<QuestionarioTemplateResource> creaNuovoQuestionarioTemplateFromUploadJson( 
			@ApiParam(name = "oggetto con schema e uischema codificati in Base64", value = "json schema e uischema template questionario da creare codificati in Base64", required = true)
			@NotNull @RequestBody @Valid final QuestionarioTemplateRequest nuovoTemplateQuestionarioRequest) {
		log.info("===> POST {}/upload", BASE_PATH);
//		final String jsonSchemaBase64 = nuovoTemplateQuestionarioRequest.getSchemaQuestionarioTemplate();
//		final String jsonUISchemaBase64 = nuovoTemplateQuestionarioRequest.getUiSchemaQuestionarioTemplate();
//		log.debug("uischema base64: {}", jsonUISchemaBase64);
//		final String schemaQuestionaeioTemplate = JsonUtil.getJson(jsonSchemaBase64);
//		final String uiSchemaQuestionarioTemplate = JsonUtil.getJson(jsonUISchemaBase64);
//		final QuestionarioTemplateCollection questionarioTemplateCreato = this.questionarioTemplateService.creaNuovoQuestionarioTemplate(
//			schemaQuestionaeioTemplate, 
//			uiSchemaQuestionarioTemplate
//		);
//		final QuestionarioTemplateResource questionarioTemplateResource = questionarioTemplateMapper.toResourceFrom(questionarioTemplateCreato);
//		return new Response<>(HttpStatus.CREATED, questionarioTemplateResource);
		return null;
	}
	
	@PutMapping(path = "/{id}/upload")
	public Response<QuestionarioTemplateResource> aggiornaQuestionarioTemplateFromUploadJson( 
			@ApiParam(name = "id", value = "id template questionario da aggiornare", required = true)
			@PathVariable(value = "id") @NotBlank String templateQuestionarioId,
			@ApiParam(name = "oggetto con schema e uischema codificati in Base64", value = "json schema e uischema template questionario da aggiornare codificati in Base64", required = true)
			@NotNull @RequestBody @Valid final QuestionarioTemplateRequest aggiornaTemplateQuestionarioRequest) {
		log.info("===> POST{}/{}/upload", BASE_PATH, templateQuestionarioId);
//		final String jsonSchemaBase64 = aggiornaTemplateQuestionarioRequest.getSchemaQuestionarioTemplate();
//		log.debug("schema base64: {}", jsonSchemaBase64);
//		final String jsonUISchemaBase64 = aggiornaTemplateQuestionarioRequest.getUiSchemaQuestionarioTemplate();
//		log.debug("uischema base64: {}", jsonUISchemaBase64);
//		final String schemaQuestionarioTemplate = JsonUtil.getJson(jsonSchemaBase64);
//		final String uiSchemaQuestionarioTemplate = JsonUtil.getJson(jsonUISchemaBase64);
//		final QuestionarioTemplateCollection questionarioTemplateAggiornato = this.questionarioTemplateService.aggiornaQuestionarioTemplate(
//			templateQuestionarioId, 
//			schemaQuestionarioTemplate, 
//			uiSchemaQuestionarioTemplate
//		);
//		final QuestionarioTemplateResource questionarioTemplateResource = questionarioTemplateMapper.toResourceFrom(questionarioTemplateAggiornato);
//		return new Response<>(HttpStatus.CREATED, questionarioTemplateResource);
		return null;
	}
}