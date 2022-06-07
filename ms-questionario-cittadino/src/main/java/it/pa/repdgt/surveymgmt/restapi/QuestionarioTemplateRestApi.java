package it.pa.repdgt.surveymgmt.restapi;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.mapper.QuestionarioTemplateMapper;
import it.pa.repdgt.surveymgmt.param.FiltroListaQuestionariTemplateParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.request.QuestionarioTemplateRequest;
import it.pa.repdgt.surveymgmt.resource.QuestionariTemplatePaginatiResource;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateLightResource;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateResource;
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
		log.info("===> POST {} - START", BASE_PATH);
		final Pageable pagina = PageRequest.of(Integer.parseInt(currPage), Integer.parseInt(pageSize));
		final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplateParam = new FiltroListaQuestionariTemplateParam();
		filtroListaQuestionariTemplateParam.setCriterioRicerca(criterioRicerca);
		filtroListaQuestionariTemplateParam.setStatoQuestionario(statoQuestionario);
		
		final Page<QuestionarioTemplateEntity> paginaQuestionariTemplate = this.questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltro(
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
	
	// TOUCH POINT 2.2.4 - 	lista questionari da aggiungere al programma
	@PostMapping(path = "/light")
	@ResponseStatus(value = HttpStatus.OK)
	public List<QuestionarioTemplateLightResource> getQuestionariTemplateLightByUtente(
			@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		List<QuestionarioTemplateEntity> questionariTemplate = this.questionarioTemplateService.getQuestionariTemplateByUtente(profilazioneParam);
		return this.questionarioTemplateMapper.toQuestionarioTemplateLightResourceFrom(questionariTemplate);
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
	
	/***
	 * Creazione di un nuovo questionario template (duplicazione)
	 * 
	 * */
	// TOUCH POINT - 1.5.4 - Crea Questionario template (duplica)
	// TOUCH POINT - 6.2 -   Crea Questionario template (duplica)
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
	public QuestionarioTemplateCollection creaQuestionarioTemplate(
			@ApiParam(name = "Crea Questionario", value = "Json contenente i dati del questionario", required = true)
			@RequestBody @Valid final QuestionarioTemplateRequest nuovoTemplateQuestionarioRequest) {
		log.info("===> POST {}", BASE_PATH);
		final QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateMapper.toCollectionFrom(nuovoTemplateQuestionarioRequest);
		return this.questionarioTemplateService.creaNuovoQuestionarioTemplate(questionarioTemplate);
	}
	
	/**
	 * Modifica un TemplateQuestionario
	 * 
	 * */
	// TOUCH POINT - 1.5.2 - Modifica questionario template
	@PutMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaQuestioarioTemplate(
			@PathVariable(value = "id")  final String questionarioTemplateId,
			@NotNull @RequestBody @Valid final QuestionarioTemplateRequest questionarioTemplateDaAggiornareRequest) {
		log.info("===> PUT {}/{}", BASE_PATH, questionarioTemplateId);
		final QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateMapper.toCollectionFrom(questionarioTemplateDaAggiornareRequest);
		this.questionarioTemplateService.aggiornaQuestionarioTemplate(
				questionarioTemplateId, 
				questionarioTemplate
		);
	}
	
	/**
	 * Cancellazione TemplateQuestionario
	 * 
	 * */
	// TOUCH POINT - 1.5.3 - Cancella questionario template
	// TOUCH POINT - 6.3   - Cancella questionario template
	@DeleteMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public void cancellaQuestioarioTemplate(
			@PathVariable(value = "id") final String questionarioTemplateId) {
		log.info("===> DELETE {}/{}", BASE_PATH, questionarioTemplateId);
		this.questionarioTemplateService.cancellaQuestionarioTemplate(questionarioTemplateId);
	}
}