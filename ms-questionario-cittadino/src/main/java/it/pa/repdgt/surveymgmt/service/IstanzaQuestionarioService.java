//package it.pa.repdgt.surveymgmt.service;
//
//import java.util.Date;
//import java.util.List;
//
//import javax.validation.constraints.NotBlank;
//import javax.validation.constraints.NotNull;
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
//import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
//import it.pa.repdgt.surveymgmt.model.IstanzaQuestionario;
//import lombok.extern.slf4j.Slf4j;
//
//@Service
//@Validated
//@Slf4j
//public class IstanzaQuestionarioService {
//	@Autowired
//	private QuestionarioTemplateService questionarioTemplateService;
//	
////	public List<IstanzaQuestionario> getAllIstanzeQuestionarioByIdTemplateQuestionario(@NotNull String idTemplateQuestionario) {
////		log.info("getAllByd - idTemplateQuestionario={} - START", idTemplateQuestionario);
////		QuestionarioTemplateCollection templateQuestionario = this.questionarioTemplateService.getQuestionarioTemplateByIdQuestionarioTemplate(idTemplateQuestionario);
////		return templateQuestionario.getIstanzeQuestionario();
////	}
////	
////	public IstanzaQuestionario getIstanzaQuestionarioByIdQuestionarioTemplateAndIdIstanzaQuestionario(@NotNull String IdQuestionarioTemplate, @NotNull String idIstanzaQuestionario) {
////		log.info("getByIdTemplateAndDataInstanceId - IdQuestionarioTemplate={}, idTemplateQuestionario={} START", IdQuestionarioTemplate, idIstanzaQuestionario);
////		QuestionarioTemplateCollection questionarioTemplate = this.questionarioTemplateService.getQuestionarioTemplateByIdQuestionarioTemplate(IdQuestionarioTemplate);
////		String errorMessage = String.format("Istanza questionario con id=%s non esiste in questionario template cond id=%s", idIstanzaQuestionario, IdQuestionarioTemplate);
////		return  questionarioTemplate.getIstanzeQuestionario()
////									.stream()
////									.filter(istanzaQuestionario -> idIstanzaQuestionario.equalsIgnoreCase(istanzaQuestionario.getId()))
////									.findFirst()
////									.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
////	}
////	
////	public QuestionarioTemplateCollection inserisciIstanzaQuestionarioInQuestionarioTemplateByIdQuestionarioTemplate(
////			@NotBlank String idQuestionarioTemplate, 
////			@NotBlank @JsonString String datiIstanzaQuestioanario) {
////		log.info("insertDataInstanceInTemplateByIdTemplate - idQuestionarioTemplate={} - START", idQuestionarioTemplate);
////		log.debug("\njson datiIstanzaQuestioanario: {}", datiIstanzaQuestioanario);
////		QuestionarioTemplateCollection questionarioTemplateFetch = this.questionarioTemplateService.getQuestionarioTemplateByIdQuestionarioTemplate(idQuestionarioTemplate);
////		DBObject dataObject = (DBObject) JSON.parse(datiIstanzaQuestioanario);
////		questionarioTemplateFetch.aggiungiDatiInstanzaTemplate(dataObject);
////		return this.questionarioTemplateService.salvaQuestionarioTemplate(questionarioTemplateFetch);
////	}
////	
////	public QuestionarioTemplateCollection aggiornaIstanzaQuestionarioByIdQuestionarioTemplateAndIdIstanzaQuestionario(
////			@NotBlank String idQuestionarioTemplate, 
////			@NotBlank String idIstanzaQuestionario,
////			@NotBlank @JsonString String datiIstanzaQuestionarioDaAggiornare) {
////		log.info("aggiornaIstanzaQuestionarioByIdQuestionarioTemplateAndIdIstanzaQuestionario - START");
////		QuestionarioTemplateCollection templateQuestionarioFetch = this.questionarioTemplateService.getQuestionarioTemplateByIdQuestionarioTemplate(idQuestionarioTemplate);
////		List<IstanzaQuestionario> istanzeQuestionarioDBFetch = this.getAllIstanzeQuestionarioByIdTemplateQuestionario(idQuestionarioTemplate);
////		String errorMessage = String.format("Istanza questionario con id=%s non esiste in questionario template con id=%s", idIstanzaQuestionario, idQuestionarioTemplate);
////		IstanzaQuestionario istanzaQuestionario = istanzeQuestionarioDBFetch
////												.stream()
////												.filter(istanza -> idIstanzaQuestionario.equalsIgnoreCase(istanza.getId()))
////												.findFirst()
////												.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
////																	
////		DBObject dataObject = (DBObject) JSON.parse(datiIstanzaQuestionarioDaAggiornare);
////		istanzaQuestionario.setDataObject(dataObject);
////		istanzaQuestionario.setUpdatingTimestamp(new Date());	
////		templateQuestionarioFetch.setIstanzeQuestionario(istanzeQuestionarioDBFetch);
////		return this.questionarioTemplateService.salvaQuestionarioTemplate(templateQuestionarioFetch);
////	}
//}