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
//public class UISchemaService {
//	@Autowired
//	private QuestionarioTemplateService templateQuestionarioService;
//	
//	@Deprecated
//	public QuestionarioTemplateCollection saveByIdTemplate(@NotBlank String idTemplateQuestionario, @NotBlank @JsonString String uiSchema) {
//		log.info("saveByIdTemplate - idTemplate={} - START", idTemplateQuestionario);
//		log.debug("\njson UISchema: {}", uiSchema);
//		QuestionarioTemplateCollection templateQuestionarioFetch = this.templateQuestionarioService.getQuestionarioTemplateByIdQuestionarioTemplate(idTemplateQuestionario);
//		DBObject schemaUIObject = (DBObject) JSON.parse(uiSchema);
//		templateQuestionarioFetch.setUIschema(schemaUIObject);
//		return this.templateQuestionarioService.salvaQuestionarioTemplate(templateQuestionarioFetch);
//	}
//	
//	@Deprecated
//	public QuestionarioTemplateCollection update(@NotBlank String idTemplateQuestionario, @NotBlank @JsonString String uiSchema) {
//		log.info("update - idTemplateQuestionario={} - START", idTemplateQuestionario);
//		log.debug("\njson UISchema: {}", uiSchema);
//		QuestionarioTemplateCollection templateQuestionarioFetch = this.templateQuestionarioService.getQuestionarioTemplateByIdQuestionarioTemplate(idTemplateQuestionario);
//		DBObject schemaObject = (DBObject) JSON.parse(uiSchema);
//		templateQuestionarioFetch.setSchema(schemaObject);
//		return this.templateQuestionarioService.salvaQuestionarioTemplate(templateQuestionarioFetch);
//	}
//}