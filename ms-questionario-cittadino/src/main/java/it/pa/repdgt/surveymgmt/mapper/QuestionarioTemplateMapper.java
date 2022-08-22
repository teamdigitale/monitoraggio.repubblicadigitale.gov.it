package it.pa.repdgt.surveymgmt.mapper;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.bson.json.JsonObject;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

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
			@Valid final QuestionarioTemplateRequest questionarioTemplateRequest ) {
		final QuestionarioTemplateCollection questionarioTemplateCollection = new QuestionarioTemplateCollection();
		questionarioTemplateCollection.setNomeQuestionarioTemplate(questionarioTemplateRequest.getNomeQuestionarioTemplate());
		questionarioTemplateCollection.setDescrizioneQuestionarioTemplate(questionarioTemplateRequest.getDescrizioneQuestionarioTemplate());
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
		sezioneQuestionarioTemplate.setId(sezioneQuestionarioTemplateRequest.getId());
		sezioneQuestionarioTemplate.setTitolo(sezioneQuestionarioTemplateRequest.getTitolo());
		sezioneQuestionarioTemplate.setSchema(new JsonObject(sezioneQuestionarioTemplateRequest.getSchema()));
		sezioneQuestionarioTemplate.setSchemaui(new JsonObject(sezioneQuestionarioTemplateRequest.getSchemaui()));
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
		questionarioTemplateEntity.setDescrizione(questionarioTemplateCollection.getDescrizioneQuestionarioTemplate());
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
		sezioneQuestionarioTemplateResource.setSchema(   ((JsonObject) sezioneQuestionarioTemplate.getSchema() ).getJson());
		sezioneQuestionarioTemplateResource.setSchemaui( ((JsonObject) sezioneQuestionarioTemplate.getSchemaui() ).getJson());
		return sezioneQuestionarioTemplateResource;
	}
	
	/**
	 * Mappa List<QuestionarioTemplateCollection> in List<QuestionarioTemplateLightResource>
	 * 
	 * */
	public List<QuestionarioTemplateLightResource> toLightResourceFrom(
			@NotNull final List<QuestionarioTemplateEntity> questionarioTemplateEntity) {
		return questionarioTemplateEntity
				.stream()
				.map(this::toLightResourceFrom)
				.collect(Collectors.toList());
	}
	
	/**
	 * Mappa QuestionarioTemplateCollection in QuestionarioTemplateLightResource
	 * 
	 * */
	public QuestionarioTemplateLightResource toLightResourceFrom(
			@NotNull final QuestionarioTemplateEntity questionarioTemplateEntity) {
		final QuestionarioTemplateLightResource questionarioTemplateLightResource = new QuestionarioTemplateLightResource();
		questionarioTemplateLightResource.setIdQuestionarioTemplate(questionarioTemplateEntity.getId());
		questionarioTemplateLightResource.setNomeQuestionarioTemplate(questionarioTemplateEntity.getNome());
		questionarioTemplateLightResource.setDescrizione(questionarioTemplateEntity.getDescrizione());
		questionarioTemplateLightResource.setStatoQuestionarioTemplate(questionarioTemplateEntity.getStato());
		questionarioTemplateLightResource.setDataOraUltimoAggiornamento(questionarioTemplateEntity.getDataOraAggiornamento());
		questionarioTemplateLightResource.setDefaultRFD(questionarioTemplateEntity.getDefaultRFD());
		questionarioTemplateLightResource.setDefaultSCD(questionarioTemplateEntity.getDefaultSCD());
		return questionarioTemplateLightResource;
	}

	/**
	 * Mappa List<QuestionarioTemplateEntity> in List<QuestionarioTemplateLightResource>
	 * 
	 * */
	public List<QuestionarioTemplateLightResource> toQuestionarioTemplateLightResourceFrom(
			@NotNull final List<QuestionarioTemplateEntity> questionariTemplate) {
		return questionariTemplate.stream()
								  .map(this::toQuestionarioTemplateLightResourceFrom)
								  .collect(Collectors.toList());
	}
	
	/**
	 * Mappa QuestionarioTemplateEntity in QuestionarioTemplateLightResource
	 * 
	 * */
	public QuestionarioTemplateLightResource toQuestionarioTemplateLightResourceFrom(
			@NotNull final QuestionarioTemplateEntity questionarioEntity) {
		final QuestionarioTemplateLightResource questionarioResource = new QuestionarioTemplateLightResource();
		questionarioResource.setIdQuestionarioTemplate(questionarioEntity.getId());
		questionarioResource.setNomeQuestionarioTemplate(questionarioEntity.getNome());
		questionarioResource.setDescrizione(questionarioEntity.getDescrizione());
		questionarioResource.setDefaultRFD(questionarioEntity.getDefaultRFD());
		questionarioResource.setDefaultSCD(questionarioEntity.getDefaultSCD());
		questionarioResource.setStatoQuestionarioTemplate(questionarioEntity.getStato());
		return questionarioResource;
	}
}