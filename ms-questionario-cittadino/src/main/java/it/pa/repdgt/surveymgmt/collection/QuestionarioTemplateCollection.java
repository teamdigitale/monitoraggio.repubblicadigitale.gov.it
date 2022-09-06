package it.pa.repdgt.surveymgmt.collection;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Classe TemplateQuestionarioCollection mappa un template di questionario.
 * 	
 *  
 * Per maggiori info vedi: https://jsonforms.io/examples/basic/
 * */

@Document(collection = "questionarioTemplate")
@Setter
@Getter
public class QuestionarioTemplateCollection implements Serializable {
	private static final long serialVersionUID = -5135985858663895848L;
	
	@Id
	@JsonIgnore
	private String mongoId;
	
	@Field(name = "id")
	private String idQuestionarioTemplate;
	
	@NotBlank
	@Field(name = "nome")
	private String nomeQuestionarioTemplate;
	
	@NotBlank
	@Field(name = "descrizione")
	private String descrizioneQuestionarioTemplate;

	@Field(name = "default-RFD")
	private Boolean defaultRFD;
	
	@Field(name = "default-SCD")
	private Boolean defaultSCD;
	
	@Field(name = "stato")
	private String stato;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraCreazione")
	private Date dataOraCreazione;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraAggiornamento")
	private Date dataOraUltimoAggiornamento;

	@Field(name = "sezioni")
	private List<SezioneQuestionarioTemplate> sezioniQuestionarioTemplate = new ArrayList<>();

	@Setter
	@Getter
	@NoArgsConstructor
	public static class SezioneQuestionarioTemplate implements Serializable {
		private static final long serialVersionUID = -3140025898522907630L;
		
		@Field(name = "id")
		private String id;

		@NotBlank
		@Field(name = "titolo")
		private String titolo;

		@NotNull
		@Field(name = "schema")
		private Object schema;
		
		@Field(name = "schemaui")
		private Object schemaui;
	}
}