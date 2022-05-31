//package it.pa.repdgt.surveymgmt.service;
//
//import javax.validation.constraints.NotBlank;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.validation.annotation.Validated;
//
//import com.mongodb.DBObject;
//import com.mongodb.util.JSON;
//
//import it.pa.repdgt.surveymgmt.annotation.JsonString;
//import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
//import lombok.extern.slf4j.Slf4j;
//
//@Service
//@Validated
//@Slf4j
//@Deprecated
//public class SchemaService {
//	@Autowired
//	private QuestionarioTemplateService templateQuestionarioService;
//	
//	@Deprecated
//	public QuestionarioTemplateCollection update(@NotBlank String idTemplate, @NotBlank @JsonString String schema) {
//		log.info("updateSchema - idTemplateQuestionario={}- START", idTemplate);
//		log.debug("\njson Schema: {}", schema);
//		QuestionarioTemplateCollection templateQuestionarioFetch = this.templateQuestionarioService.getQuestionarioTemplateByIdQuestionarioTemplate(idTemplate);
//		DBObject schemaObject = (DBObject) JSON.parse(schema);
//		templateQuestionarioFetch.setSchema(schemaObject);
//		return this.templateQuestionarioService.salvaQuestionarioTemplate(templateQuestionarioFetch);
//	}
//}