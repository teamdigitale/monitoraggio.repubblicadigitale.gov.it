//package it.pa.repdgt.surveymgmt.restapi;
//
//import javax.validation.constraints.NotBlank;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.validation.BindingResult;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import io.swagger.annotations.ApiParam;
//import it.pa.repdgt.surveymgmt.annotation.JsonString;
//import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
//import it.pa.repdgt.surveymgmt.mapper.QuestionarioTemplateMapper;
//import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateResource;
//import it.pa.repdgt.surveymgmt.response.Response;
//import it.pa.repdgt.surveymgmt.service.SchemaService;
//import lombok.extern.slf4j.Slf4j;
//
//@RestController
//@RequestMapping(path = "rest/api/v1/template")
//@Validated
//@Slf4j
//@Deprecated
//public class SchemaTemplateQuestionarioRestApi {
//	@Autowired
//	private SchemaService schemaService;
//	@Autowired
//	private QuestionarioTemplateMapper templQuestMapper;
//	
//	/**
//	 * 
//	 * 
//	 * */
//	@Deprecated
//	@PutMapping(path = "{id}/schema")
//	public Response<QuestionarioTemplateResource> updateTemplateWithSchema(
//			@ApiParam(name = "id", value = "id template questionario da aggiornare" ,required = true)
//			@PathVariable(value = "id") @NotBlank String idTemplateQuestionario,
//			@ApiParam(name = "schema", value = "json schema template questionario" ,required = true)
//			@RequestBody @NotBlank @JsonString String schema,
//			BindingResult bindingResult ) {
//		log.info("===> PUT /rest/api/v1/template/{}/schema", idTemplateQuestionario);
//		QuestionarioTemplateCollection templateQuest = this.schemaService.update(idTemplateQuestionario, schema);
//		QuestionarioTemplateResource templateQuestResource = this.templQuestMapper.toResourceFrom(templateQuest);
//		return  new Response<>(HttpStatus.OK, templateQuestResource);
//	}
//}