package it.pa.repdgt.ente.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReferenteDelegatoGestoreProgrammaRequest {
	
	@NotBlank
	@JsonProperty(value = "cfReferenteDelegato", required = true)
	private String codiceFiscaleUtente;

	@NotNull
	@JsonProperty(value = "idProgramma", required = true)
	private Long idProgramma;
	
	//Referente o Delegato (REG o DEG)
	@NotNull
	@JsonProperty(value = "codiceRuolo", required = true)
	private String codiceRuolo;
	
	@NotNull
	@JsonProperty(value = "idEnte", required = true)
	private Long idEnte;
	
	@JsonProperty(value = "mansione", required = true)
	private String mansione;
}