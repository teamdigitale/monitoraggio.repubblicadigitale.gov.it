package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "questionarioTemplateResource")
public class QuestionarioTemplateResource implements Serializable {
	private static final long serialVersionUID = -5466941482810667903L;

	@JsonProperty(value = "survey-id")
	private String id;

	@JsonProperty(value = "survey-name")
	private String nomeQuestionarioTemplate;

	@JsonProperty(value = "survey-description")
	private String descrizioneQuestionarioTemplate;

	@JsonProperty(value = "default-RFD")
	private Boolean defaultRFD;

	@JsonProperty(value = "default-SCD")
	private Boolean defaultSCD;
	
	@JsonProperty(value = "last-update")
	private Date dataOraUltimoAggiornamento;
	
	@JsonProperty(value = "stato")
	private String stato;
	
	@JsonProperty(value = "survey-sections")
	private List<SezioneQuestionarioTemplateResource> sezioniQuestionarioTemplate = new ArrayList<>();

	@Setter
	@Getter
	public static class SezioneQuestionarioTemplateResource implements Serializable {
		private static final long serialVersionUID = 7436588778744407710L;
		
		@JsonProperty(value = "id")
		private String id;
		
		@JsonProperty(value = "title")
		private String titolo;

		@JsonProperty(value = "schema")
		private String schema;
		
		@JsonProperty(value = "schemaui")
		private String schemaui;
	}
}