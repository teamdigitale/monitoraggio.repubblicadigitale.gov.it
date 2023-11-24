package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CittadinoRequest extends SceltaProfiloParam implements Serializable {
	private static final long serialVersionUID = 443289012578169806L;

	@JsonProperty(value = "codiceFiscale")
	private String codiceFiscale;

	@JsonProperty(value = "codiceFiscaleNonDisponibile")
	private Boolean codiceFiscaleNonDisponibile;

	@JsonProperty(value = "tipoDocumento")
	private String tipoDocumento;

	@JsonProperty(value = "numeroDocumento")
	private String numeroDocumento;

	@JsonProperty(value = "genere")
	private String genere;

	@JsonProperty(value = "annoNascita")
	private String fasciaDiEta;

	@JsonProperty(value = "titoloStudio")
	private String titoloStudio;

	@JsonProperty(value = "statoOccupazionale")
	private String statoOccupazionale;

	@JsonProperty(value = "cittadinanza")
	private String cittadinanza;

	@JsonProperty(value = "questionarioQ1")
	private String questionarioQ1;
}