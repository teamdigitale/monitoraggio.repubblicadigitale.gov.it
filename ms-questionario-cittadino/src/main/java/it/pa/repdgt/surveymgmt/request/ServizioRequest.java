package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;
import java.util.Date;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.surveymgmt.annotation.JsonString;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "servizioRequest")
public class ServizioRequest implements Serializable {
	private static final long serialVersionUID = 443289012578169806L;

	@NotNull
	@Valid
	private ProfilazioneParam profilazioneParam;

	@JsonProperty(value = "nomeServizio")
	@NotBlank
	private String nomeServizio;
	
	@JsonProperty(value = "idEnte")
	@NotNull
	private Long idEnte;
	
	@JsonProperty(value = "idSede")
	@NotNull
	private Long idSede;
	
	@JsonProperty(value = "data")
	@NotNull
	private Date dataServizio;

	@JsonProperty(value = "durataServizio")
	@NotNull
	private Long durataServizio;
	
	@JsonProperty(value = "tipoDiServizioPrenotato")
	@NotBlank
	private String tipologiaServizio;
	
	@JsonProperty(value = "sezioneQuestionarioCompilatoQ3")
	@NotBlank
	@JsonString
	private String sezioneQuestionarioCompilatoQ3;
}