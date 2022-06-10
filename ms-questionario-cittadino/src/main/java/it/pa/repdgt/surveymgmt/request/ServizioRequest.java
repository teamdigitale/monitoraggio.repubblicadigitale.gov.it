package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

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
@JsonRootName(value = "servizio")
public class ServizioRequest implements Serializable {
	private static final long serialVersionUID = 443289012578169806L;

	@NotNull
	@Valid
	private ProfilazioneParam profilazioneParam;

	@JsonProperty(value = "nomeServizio")
	@NotBlank
	private String nomeServizio;
	
	@JsonProperty(value = "durataServizio")
	private Long durataServizio;
	
	@JsonProperty(value = "questioanatioCompilatoQ3")
	@JsonString
	private String questionarioCompilatoQ3;
	
	@JsonProperty(value = "idEnte")
	private Long idEnte;
	
	@JsonProperty(value = "idSede")
	private Long idSede;
}