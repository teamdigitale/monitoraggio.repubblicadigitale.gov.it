package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@JsonRootName(value = "questionarioTemplate")
@Setter
@Getter
public class QuestionarioTemplateLightResource implements Serializable {
	private static final long serialVersionUID = -7310465062300554193L;

	@JsonProperty(value = "nome")
	private String nomeQuestionarioTemplate;

	@JsonProperty(value = "id")
	private String idQuestionarioTemplate;

	@JsonProperty(value = "stato")
	private String statoQuestionarioTemplate;

	@JsonProperty(value = "dataUltimaModifica")
	private Date dataOraUltimoAggiornamento;
	
	@JsonProperty(value = "defaultRFD")
	private Boolean defaultRFD;

	@JsonProperty(value = "defaultSCD")
	private Boolean defaultSCD;
}