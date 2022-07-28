package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.surveymgmt.annotation.JsonString;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "QuestionarioTemplate")
public class QuestionarioTemplateRequest implements Serializable {
	private static final long serialVersionUID = -8965868376040729013L;

	@JsonProperty(value = "survey-name")
	@NotBlank
	private String nomeQuestionarioTemplate;

	@JsonProperty(value = "survey-description")
	@NotBlank
	private String descrizioneQuestionarioTemplate;

	@JsonProperty(value = "survey-sections")
	@NotEmpty
	@Valid
	private List<SezioneQuestionarioTemplateRequest> sezioniQuestionarioTemplate;
	
	@Setter
	@Getter
	public static class SezioneQuestionarioTemplateRequest implements Serializable {
		private static final long serialVersionUID = -5090611819310162542L;
		
		@JsonProperty(value = "id")
		@NotBlank
		private String id;

		@JsonProperty(value = "title")
		@NotBlank
		private String titolo;
		
		@JsonProperty(value = "default-section")
		@NotNull
		private Boolean sezioneDiDefault;
		
		@JsonProperty(value = "schema")
		@JsonString
		private String schema;
		
		@JsonProperty(value = "schemaui")
		@JsonString
		private String schemaui;
	}
}