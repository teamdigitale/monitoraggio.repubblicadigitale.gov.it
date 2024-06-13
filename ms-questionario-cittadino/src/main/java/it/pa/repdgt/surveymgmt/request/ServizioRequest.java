package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParamLightProgramma;
import it.pa.repdgt.surveymgmt.annotation.JsonString;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "servizioRequest")
public class ServizioRequest extends SceltaProfiloParam implements Serializable {
	private static final long serialVersionUID = 443289012578169806L;

	@JsonProperty(value = "nomeServizio")
	@NotBlank
	private String nomeServizio;

	@JsonProperty(value = "idEnteServizio")
	@NotNull
	private Long idEnteServizio;

	@JsonProperty(value = "idSedeServizio")
	@NotNull
	private Long idSedeServizio;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@JsonProperty(value = "data")
	@NotNull
	private Date dataServizio;

	@JsonProperty(value = "durataServizio")
	@NotNull
	private String durataServizio;

	@JsonProperty(value = "tipoDiServizioPrenotato")
	@NotEmpty
	private List<String> listaTipologiaServizi;

	@JsonProperty(value = "sezioneQuestionarioCompilatoQ3")
	@NotBlank
	@JsonString
	private String sezioneQuestionarioCompilatoQ3;
}