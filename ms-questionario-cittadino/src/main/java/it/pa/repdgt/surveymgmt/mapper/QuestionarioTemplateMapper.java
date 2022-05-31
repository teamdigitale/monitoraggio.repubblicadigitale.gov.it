package it.pa.repdgt.surveymgmt.mapper;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import com.mongodb.util.JSON;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection.SezioneQuestionarioTemplate;
import it.pa.repdgt.surveymgmt.request.QuestionarioTemplateRequest;
import it.pa.repdgt.surveymgmt.request.QuestionarioTemplateRequest.SezioneQuestionarioTemplateRequest;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateLightResource;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateResource;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateResource.SezioneQuestionarioTemplateResource;

@Component
@Validated
public class QuestionarioTemplateMapper {
		
	/**
	 * Mappa QuestionarioTemplateRequest in QuestionarioTemplateCollection
	 * 
	 * */
	public QuestionarioTemplateCollection toCollectionFrom(
			@NotNull(message = "QuestionarioTemplateRequest deve essere non null") 
			@Valid final QuestionarioTemplateRequest questionarioTemplateRequest)  {
		final QuestionarioTemplateCollection questionarioTemplateCollection = new QuestionarioTemplateCollection();
		questionarioTemplateCollection.setNomeQuestionarioTemplate(questionarioTemplateRequest.getNomeQuestionarioTemplate());
		questionarioTemplateCollection.setDescrizioneQuestionarioTemplate(questionarioTemplateRequest.getDescrizioneQuestionarioTemplate());
		questionarioTemplateCollection.setDescrizioneQuestionarioTemplate(questionarioTemplateRequest.getDescrizioneQuestionarioTemplate());
		questionarioTemplateCollection.setDefaultRFD(questionarioTemplateRequest.getDefaultRFD());
		questionarioTemplateCollection.setDefaultSCD(questionarioTemplateRequest.getDefaultSCD());
		final List<SezioneQuestionarioTemplate> sezioniQuestionario = this.toCollectionFrom(questionarioTemplateRequest.getSezioniQuestionarioTemplate());
		questionarioTemplateCollection.setSezioniQuestionarioTemplate(sezioniQuestionario);
		return questionarioTemplateCollection;
	}
	
	/**
	 * Mappa List<SezioneQuestionarioTemplateRequest> in List<SezioneQuestionarioTemplate>
	 * 
	 * */
	public List<SezioneQuestionarioTemplate> toCollectionFrom(
			@NotNull(message = "Lista<SezioneQuestionarioTemplate> deve essere non null") 
			final List<SezioneQuestionarioTemplateRequest> sezioniQuestionarioTemplateRequest) {
		return sezioniQuestionarioTemplateRequest
				.stream()
				.map(this::toCollectionFrom)
				.collect(Collectors.toList());
	}
	
	/**
	 * Mappa sezioneQuestionarioTemplateRequest in SezioneQuestionarioTemplate
	 * 
	 * */
	public SezioneQuestionarioTemplate toCollectionFrom(
			@NotNull(message = "SezioneQuestionarioTemplateRequest deve essere non null") 
			@Valid final SezioneQuestionarioTemplateRequest sezioneQuestionarioTemplateRequest) {
		final SezioneQuestionarioTemplate sezioneQuestionarioTemplate = new QuestionarioTemplateCollection.SezioneQuestionarioTemplate();
		sezioneQuestionarioTemplate.setTitolo(sezioneQuestionarioTemplateRequest.getTitolo());
		sezioneQuestionarioTemplate.setSezioneDiDefault(sezioneQuestionarioTemplateRequest.getSezioneDiDefault());
		sezioneQuestionarioTemplate.setSchema(JSON.parse(sezioneQuestionarioTemplateRequest.getSchema()));
		sezioneQuestionarioTemplate.setSchemaui(JSON.parse(sezioneQuestionarioTemplateRequest.getSchemaui()));
		return sezioneQuestionarioTemplate;
	}

	/**
	 * Mappa QuestionarioTemplateCollection in QuestionarioTemplateEntity
	 * 
	 * */
	public QuestionarioTemplateEntity toEntityFrom(
			@NotNull(message = "QuestionarioTemplateCollection deve essere non null") 
			final QuestionarioTemplateCollection questionarioTemplateCollection) {
		final QuestionarioTemplateEntity questionarioTemplateEntity = new QuestionarioTemplateEntity();
		questionarioTemplateEntity.setId(questionarioTemplateCollection.getIdQuestionarioTemplate());
		questionarioTemplateEntity.setNome(questionarioTemplateCollection.getNomeQuestionarioTemplate());
		questionarioTemplateEntity.setStato(questionarioTemplateCollection.getStato());
		questionarioTemplateEntity.setDefaultRFD(questionarioTemplateCollection.getDefaultRFD());
		questionarioTemplateEntity.setDefaultSCD(questionarioTemplateCollection.getDefaultSCD());
		questionarioTemplateEntity.setDataOraCreazione(questionarioTemplateCollection.getDataOraCreazione());
		questionarioTemplateEntity.setDataOraAggiornamento(questionarioTemplateCollection.getDataOraUltimoAggiornamento());
		return questionarioTemplateEntity;
	}

	/**
	 * Mappa QuestionarioTemplateCollection in QuestionarioTemplateResource
	 * 
	 * */
	public QuestionarioTemplateResource toResourceFrom(
			@NotNull(message = "QuestionarioTemplateCollection deve essere non null") 
			final QuestionarioTemplateCollection questionarioTemplateCollection) {
		final QuestionarioTemplateResource questionarioTemplateResource = new QuestionarioTemplateResource();
		questionarioTemplateResource.setId(questionarioTemplateCollection.getIdQuestionarioTemplate());
		questionarioTemplateResource.setNomeQuestionarioTemplate(questionarioTemplateCollection.getNomeQuestionarioTemplate());
		questionarioTemplateResource.setDescrizioneQuestionarioTemplate(questionarioTemplateCollection.getDescrizioneQuestionarioTemplate());
		questionarioTemplateResource.setDefaultRFD(questionarioTemplateCollection.getDefaultRFD());
		questionarioTemplateResource.setDefaultSCD(questionarioTemplateCollection.getDefaultSCD());
		questionarioTemplateResource.setDataOraUltimoAggiornamento(questionarioTemplateCollection.getDataOraUltimoAggiornamento());
		questionarioTemplateResource.setSezioniQuestionarioTemplate(this.toResouceFrom(questionarioTemplateCollection.getSezioniQuestionarioTemplate()));
		return questionarioTemplateResource;
	}
	
	/**
	 * Mappa List<SezioneQuestionarioTemplate> in List<SezioneQuestionarioTemplateResource>
	 * 
	 * */
	public List<SezioneQuestionarioTemplateResource> toResouceFrom(
			@NotNull(message = "List<SezioneQuestionarioTemplateResource> deve essere non null") 
			final List<SezioneQuestionarioTemplate> sezioniQuestionarioTemplate) {
		return sezioniQuestionarioTemplate
				.stream()
				.map(this::toResouceFrom)
				.collect(Collectors.toList());
	}

	/**
	 * Mappa SezioneQuestionarioTemplate in SezioneQuestionarioTemplateResource
	 * 
	 * */
	public SezioneQuestionarioTemplateResource toResouceFrom(
			@NotNull(message = "SezioneQuestionarioTemplateResource deve essere non null") 
			final SezioneQuestionarioTemplate sezioneQuestionarioTemplate) {
		final SezioneQuestionarioTemplateResource sezioneQuestionarioTemplateResource = new QuestionarioTemplateResource.SezioneQuestionarioTemplateResource();
		sezioneQuestionarioTemplateResource.setId(sezioneQuestionarioTemplate.getId());
		sezioneQuestionarioTemplateResource.setTitolo(sezioneQuestionarioTemplate.getTitolo());
		sezioneQuestionarioTemplateResource.setSezioneDiDefault(sezioneQuestionarioTemplate.getSezioneDiDefault());
		sezioneQuestionarioTemplateResource.setSchema(sezioneQuestionarioTemplate.getSchema());
		sezioneQuestionarioTemplateResource.setSchemaui(sezioneQuestionarioTemplate.getSchemaui());
		return sezioneQuestionarioTemplateResource;
	}
	
	/**
	 * Mappa List<QuestionarioTemplateCollection> in List<QuestionarioTemplateLightResource>
	 * 
	 * */
	public List<QuestionarioTemplateLightResource> toLightResourceFrom(
			@NotNull final List<QuestionarioTemplateCollection> questionarioTemplateCollection) {
		return questionarioTemplateCollection
				.stream()
				.map(this::toLightResourceFrom)
				.collect(Collectors.toList());
	}
	
	/**
	 * Mappa QuestionarioTemplateCollection in QuestionarioTemplateLightResource
	 * 
	 * */
	public QuestionarioTemplateLightResource toLightResourceFrom(
			@NotNull final QuestionarioTemplateCollection questionarioTemplateCollection) {
		final QuestionarioTemplateLightResource questionarioTemplateLightResource = new QuestionarioTemplateLightResource();
		questionarioTemplateLightResource.setIdQuestionarioTemplate(questionarioTemplateCollection.getIdQuestionarioTemplate());
		questionarioTemplateLightResource.setNomeQuestionarioTemplate(questionarioTemplateCollection.getNomeQuestionarioTemplate());
		questionarioTemplateLightResource.setStatoQuestionarioTemplate(questionarioTemplateCollection.getStato());
		questionarioTemplateLightResource.setDataOraUltimoAggiornamento(questionarioTemplateCollection.getDataOraUltimoAggiornamento());
		questionarioTemplateLightResource.setDefaultRFD(questionarioTemplateCollection.getDefaultRFD());
		questionarioTemplateLightResource.setDefaultSCD(questionarioTemplateCollection.getDefaultSCD());
		return questionarioTemplateLightResource;
	}
}