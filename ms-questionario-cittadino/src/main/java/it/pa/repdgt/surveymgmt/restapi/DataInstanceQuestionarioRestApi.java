//package it.pa.repdgt.surveymgmt.restapi;
//
//import java.util.List;
//
//import javax.validation.constraints.NotBlank;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.validation.BindingResult;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import io.swagger.annotations.ApiParam;
//import it.pa.repdgt.surveymgmt.annotation.JsonString;
//import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
//import it.pa.repdgt.surveymgmt.mapper.DataInstanceTemplateListMapper;
//import it.pa.repdgt.surveymgmt.mapper.DataInstanceTemplateMapper;
//import it.pa.repdgt.surveymgmt.mapper.QuestionarioTemplateMapper;
//import it.pa.repdgt.surveymgmt.model.IstanzaQuestionario;
//import it.pa.repdgt.surveymgmt.resource.DataInstanceTemplateResource;
//import it.pa.repdgt.surveymgmt.resource.DataInstancesTempleteResource;
//import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateResource;
//import it.pa.repdgt.surveymgmt.response.Response;
//import it.pa.repdgt.surveymgmt.service.IstanzaQuestionarioService;
//import it.pa.repdgt.surveymgmt.util.JsonUtil;
//import lombok.extern.slf4j.Slf4j;
//
//@RestController
//@RequestMapping(path = "rest/api/v1/template")
//@Validated
//@Slf4j
//public class DataInstanceQuestionarioRestApi {
//	private static final String BASE_PATH = "rest/api/v1/template";
//	
//	@Autowired
//	private IstanzaQuestionarioService dataInstanceService;
//	@Autowired 
//	private QuestionarioTemplateMapper tmplQuestMapper;
//	@Autowired
//	private DataInstanceTemplateListMapper dataInstTemplListMapper;
//	@Autowired
//	private DataInstanceTemplateMapper dataInstTmplMapper;
//
//	/***
//	 * Restituisce i dati di tutte le istanze di TemplateQuestionario persistiti su database MongoDb
//	 * 
//	 * */
//	@GetMapping(path = "/{id}/data", produces = {MediaType.APPLICATION_JSON_VALUE})
//	public Response<DataInstancesTempleteResource> getAllDataInstances(
//			@ApiParam(name = "id", value = "id template questionario" ,required = true)
//			@PathVariable(value = "id") @NotBlank String templateQuestionarioId ) {
//		log.info("===> GET {}/{}/data - START", BASE_PATH, templateQuestionarioId);
//		List<IstanzaQuestionario> dataInstanceTemplateList = this.dataInstanceService.getAllIstanzeQuestionarioByIdTemplateQuestionario(templateQuestionarioId);
//		DataInstancesTempleteResource dataInstancesResouce = dataInstTemplListMapper.toResourceFrom(dataInstanceTemplateList);
//		return new Response<>(HttpStatus.OK, dataInstancesResouce);
//	}
//	
//	/***
//	 * Restituisce i dati di un istanza del TemplateQuestionario persistiti su database MongoDb
//	 * 
//	 * */
//	@GetMapping(path = "/{id}/data/{idData}",  produces = {MediaType.APPLICATION_JSON_VALUE})
//	public Response<DataInstanceTemplateResource> getDataInstanceBy(
//			@ApiParam(name = "id", value = "id template questionario" ,required = true)
//			@PathVariable(value = "id") @NotBlank String templateQuestionarioId,
//			@ApiParam(name = "idData", value = "id dati template questionario" ,required = true)
//			@PathVariable(value = "idData") @NotBlank String dataInstanceId ) {
//		log.info("===> GET {}/{}/data/{} - START", BASE_PATH, templateQuestionarioId, dataInstanceId);
//		IstanzaQuestionario dataInstanceTemplate = this.dataInstanceService.getIstanzaQuestionarioByIdQuestionarioTemplateAndIdIstanzaQuestionario(templateQuestionarioId, dataInstanceId);
//		DataInstanceTemplateResource dataInstanceResouce = dataInstTmplMapper.toResourceFrom(dataInstanceTemplate);
//		return new Response<>(HttpStatus.OK, dataInstanceResouce);
//	}
//	
//	/**
//	 * 
//	 * 
//	 * */
//	@PutMapping(path = "/{id}/data")
//	public Response<QuestionarioTemplateResource> insertDataInstanceIntoTemplateBy(
//			@ApiParam(name = "id", value = "id template questionario" ,required = true)
//			@PathVariable(value = "id") final String idTemplateQuestionario,
//			@ApiParam(name = "schema", value = "json data questionario template" ,required = true)
//			@RequestBody @NotBlank @JsonString final String dataInstance,
//			BindingResult bindingResult ) {
//		log.info("===> PUT {}/{}/data", BASE_PATH, idTemplateQuestionario);
//		final QuestionarioTemplateCollection templateQuestionario = this.dataInstanceService.inserisciIstanzaQuestionarioInQuestionarioTemplateByIdQuestionarioTemplate(
//			idTemplateQuestionario, 
//			dataInstance
//		);
//		final QuestionarioTemplateResource templateQuestionarioResource = this.tmplQuestMapper.toResourceFrom(templateQuestionario);
//		return new Response<>(HttpStatus.OK, templateQuestionarioResource);
//	}
//	
//	/**
//	 * Aggiorna i dati di istanza di un templateQuestionario.
//	 * 
//	 * */
//	@PutMapping(path = "{id}/data/{idData}")
//	public Response<QuestionarioTemplateResource> updateExistingDataInstanceBy( 
//			@ApiParam(name = "id", value = "id template" ,required = true)
//			@PathVariable(value = "id", required = true) 
//			@NotBlank String idTemplate,
//			@ApiParam(name = "idData", value = "id data instance template" ,required = true)
//			@PathVariable(value = "idData", required = true) 
//			@NotBlank String idDataInstance,
//			@ApiParam(name = "dati instanza questionario", value = "json string dati instanza questionario da aggiornare", required = true)
//			/*@Pattern(regexp = "^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$")*/
//			@RequestBody @JsonString String dataInstanceToUpd ) {
//		log.info("===> PUT {}/{}/data/{}", BASE_PATH, idTemplate, idDataInstance);
//		QuestionarioTemplateCollection templateQuestionario = null;
//		templateQuestionario = this.dataInstanceService.aggiornaIstanzaQuestionarioByIdQuestionarioTemplateAndIdIstanzaQuestionario(idTemplate, idDataInstance, dataInstanceToUpd);
//		QuestionarioTemplateResource templateQuestionarioResource = this.tmplQuestMapper.toResourceFrom(templateQuestionario);
//		return new Response<>(HttpStatus.OK, templateQuestionarioResource);
//	}
//	
//	/**
//	 *  Upload json file per dati instanza template questionario tramite file codificato in Base64
//	 *
//	 * */
//	@Deprecated
//	@PutMapping(path = "{id}/datainstance/upload")
//	public Response<QuestionarioTemplateResource> updateTemplateFromUploadData( 
//			@ApiParam(name = "id", value = "id template" ,required = true)
//			@PathVariable(value = "id", required = true) @NotBlank final String idTemplate,
//			@ApiParam(name = "input file", value = "codifica base 64 file dati da fare upload" ,required = true)
//			/*@Pattern(regexp = "^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$")*/
//			@RequestBody final String dataInstanceBase64Encoded) {
//		log.info("===> PUT {}/{}/upload/file", BASE_PATH, idTemplate);
//		log.debug("upload base64: {}", dataInstanceBase64Encoded);
//		final String dataInstance = JsonUtil.getJson(dataInstanceBase64Encoded);
//		final QuestionarioTemplateCollection questionarioTemplate = this.dataInstanceService.inserisciIstanzaQuestionarioInQuestionarioTemplateByIdQuestionarioTemplate(
//			idTemplate, 
//			dataInstance
//		);
//		final QuestionarioTemplateResource questionarioTemplateResource = this.tmplQuestMapper.toResourceFrom(questionarioTemplate);
//		return new Response<>(HttpStatus.OK, questionarioTemplateResource);
//	}
//}