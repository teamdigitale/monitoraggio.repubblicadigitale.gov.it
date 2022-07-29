package it.pa.repdgt.surveymgmt.restapi;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.commons.csv.CSVFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import it.pa.repdgt.surveymgmt.util.CSVQuestionarioTemplateUtil;

@RestController
@RequestMapping(path = "questionarioTemplate")
@Validated
public class QuestionarioTemplateRestApi {
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
			@RequestParam(name = "criterioRicerca", required = false) final String criterioRicerca,
			@RequestParam(name = "stato",           required = false) final String statoQuestionarioTemplate,
			@RequestParam(name = "currPage", defaultValue = "0")  final String currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") final String pageSize,
			@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final Pageable pagina = PageRequest.of(Integer.parseInt(currPage), Integer.parseInt(pageSize));
		final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplateParam = new FiltroListaQuestionariTemplateParam();
		filtroListaQuestionariTemplateParam.setCriterioRicerca(criterioRicerca);
		filtroListaQuestionariTemplateParam.setStatoQuestionario(statoQuestionarioTemplate);
		final Page<QuestionarioTemplateEntity> paginaQuestionariTemplate = this.questionarioTemplateService.getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(
				profilazioneParam,
				filtroListaQuestionariTemplateParam,
				pagina
			);
		final List<QuestionarioTemplateLightResource> questionariTemplateLightResource = this.questionarioTemplateMapper.toLightResourceFrom(paginaQuestionariTemplate.getContent());
		return new QuestionariTemplatePaginatiResource(
				questionariTemplateLightResource,
				paginaQuestionariTemplate.getTotalPages(),
				paginaQuestionariTemplate.getTotalElements()
			);
	}
	
	/***
	 * Restituisce tutti gli stati dei TemplateQuestionario persistiti su database MongoDb 
	 * 
	 * */
	// TOUCH POINT - 1.5.5 - Lista stati questionari
	@PostMapping(path = "/stati/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllStatiDropdown(
			@RequestParam(name = "criterioRicerca", required = false) final String criterioRicerca,
			@RequestParam(name = "stato",           required = false) final String statoQuestionarioTemplate,
			@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplateParam = new FiltroListaQuestionariTemplateParam();
		filtroListaQuestionariTemplateParam.setCriterioRicerca(criterioRicerca);
		filtroListaQuestionariTemplateParam.setStatoQuestionario(statoQuestionarioTemplate);
		List<String> listaStati = this.questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(
				profilazioneParam,
				filtroListaQuestionariTemplateParam
			);
		return listaStati;
	}
	
	// TOUCH POINT 2.2.4 - 	lista questionari da aggiungere al programma
	@PostMapping(path = "/all/light")
	@ResponseStatus(value = HttpStatus.OK)
	public List<QuestionarioTemplateLightResource> getQuestionariTemplateLightByUtente(
			@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final List<QuestionarioTemplateEntity> questionariTemplate = this.questionarioTemplateService.getQuestionariTemplateByUtente(profilazioneParam);
		return this.questionarioTemplateMapper.toQuestionarioTemplateLightResourceFrom(questionariTemplate);
	}
	
	/***
	 * Restituisce il TemplateQuestionario con specifico id persistito su mongoDB
	 * 
	 * */
	// TOUCH POINT - 2.1.4 - Visualizza scheda questionario 
	// TOUCH POINT - 6.1 -   Visualizza scheda questionario
	@GetMapping(path = "/{idQuestionario}",  produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public QuestionarioTemplateResource getQuestioanarioTemplateById(
			@PathVariable(value = "idQuestionario") final String templateQuestionarioId) {
		final QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateService.getQuestionarioTemplateById(templateQuestionarioId.trim());
		return questionarioTemplateMapper.toResourceFrom(questionarioTemplate);
	}
	
	/***
	 * Creazione di un nuovo questionario template (duplicazione)
	 * 
	 * */
	// TOUCH POINT - 1.5.4 - Crea Questionario template (duplica)
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
	public QuestionarioTemplateResource creaQuestionarioTemplate(
			@ApiParam(name = "Crea Questionario", value = "Json contenente i dati del questionario", required = true)
			@RequestBody @Valid final QuestionarioTemplateRequest nuovoTemplateQuestionarioRequest) {
		final QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateMapper.toCollectionFrom(nuovoTemplateQuestionarioRequest);
		QuestionarioTemplateCollection questionarioCreato = this.questionarioTemplateService.creaNuovoQuestionarioTemplate(questionarioTemplate);
		return questionarioTemplateMapper.toResourceFrom(questionarioCreato);
	}
	
	/**
	 * Modifica un TemplateQuestionario
	 * 
	 * */
	// TOUCH POINT - 1.5.2 - Modifica questionario template
	// TOUCH POINT - 6.2 -   Crea Questionario template (duplica)
	@PutMapping(path = "/{idQuestionario}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaQuestioarioTemplate(
			@PathVariable(value = "idQuestionario")  final String questionarioTemplateId,
			@NotNull @RequestBody @Valid final QuestionarioTemplateRequest questionarioTemplateDaAggiornareRequest) {
		final QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateMapper.toCollectionFrom(questionarioTemplateDaAggiornareRequest);
		this.questionarioTemplateService.aggiornaQuestionarioTemplate(
				questionarioTemplateId, 
				questionarioTemplate
		);
	}
	
	/**
	 * Modifica i default di un TemplateQuestionario
	 * 
	 * */
	@PutMapping(path = "/aggiornadefault/{idQuestionario}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaDefaultQuestionarioTemplate(
			@PathVariable(value = "idQuestionario") final String idQuestionario,
			@RequestParam final String tipoDefault) {
		this.questionarioTemplateService.aggiornaDefaultQuestionarioTemplate(idQuestionario, tipoDefault);
	}
	
	/**
	 * Cancellazione TemplateQuestionario
	 * 
	 * */
	// TOUCH POINT - 1.5.3 - Cancella questionario template
	// TOUCH POINT - 6.3   - Cancella questionario template
	@DeleteMapping(path = "/{idQuestionario}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellaQuestioarioTemplate(@PathVariable(value = "idQuestionario") final String questionarioTemplateId) {
		this.questionarioTemplateService.cancellaQuestionarioTemplate(questionarioTemplateId);
	}
	
	/**
	 * Scarica lista elenco questionaritemplate,
	 * in base ai filtri richiesti e alla profilazione dell'utente loggatosi
	 * 
	 * */
	// TOUCH POINT - 1.5.6
	@PostMapping(path = "/download")
	@ResponseStatus(value = HttpStatus.OK)
	public ResponseEntity<InputStreamResource> downloadCSVSElencoQuestionariTemplate(
			@RequestParam(name = "criterioRicerca", required = false) final String criterioRicerca,
			@RequestParam(name = "stato",           required = false) final String statoQuestionarioTemplate,
			@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplateParam = new FiltroListaQuestionariTemplateParam();
		filtroListaQuestionariTemplateParam.setCriterioRicerca(criterioRicerca);
		filtroListaQuestionariTemplateParam.setStatoQuestionario(statoQuestionarioTemplate);
		final List<QuestionarioTemplateEntity> questionariTemplateEntity = this.questionarioTemplateService.getAllQuestionariTemplateByProfilazioneAndFiltro(
				profilazioneParam,
				filtroListaQuestionariTemplateParam
			);
		final List<QuestionarioTemplateLightResource> questionariResource = this.questionarioTemplateMapper.toLightResourceFrom(questionariTemplateEntity);
		final ByteArrayInputStream byteArrayInputStream = CSVQuestionarioTemplateUtil.exportCSVQuestionariTemplate(questionariResource, CSVFormat.DEFAULT);
		final InputStreamResource fileCSVCreato = new InputStreamResource(byteArrayInputStream);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=elenco-questionari-template.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSVCreato);
	}
}