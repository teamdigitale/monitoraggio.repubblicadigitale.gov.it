package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(value = Include.NON_NULL)
public class CittadinoServizioResource implements Serializable {
	private static final long serialVersionUID = -661976690923589119L;

	@JsonProperty(value = "idCittadino")
	private Long IdCittadino;

	@JsonProperty(value = "codiceFiscale")
	private String codiceFiscale;

	@JsonProperty(value = "numeroDocumento")
	private String numeroDocumento;

	@JsonProperty(value = "idQuestionario")
	private String idQuestionario;

	@JsonProperty(value = "statoQuestionario")
	private String statoQuestionario;
}