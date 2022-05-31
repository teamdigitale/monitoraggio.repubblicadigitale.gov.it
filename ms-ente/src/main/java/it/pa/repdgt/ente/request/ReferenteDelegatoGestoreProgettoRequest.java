package it.pa.repdgt.ente.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReferenteDelegatoGestoreProgettoRequest{
	
	@NotBlank
	@JsonProperty(value = "cfUtente", required = true)
	private String codiceFiscaleUtente;

	@NotNull
	@JsonProperty(value = "idProgetto", required = true)
	private Long idProgetto;
	
	//Referente o Delegato (REGP o DEGP)
	@NotNull
	@JsonProperty(value = "codiceRuolo", required = true)
	private String codiceRuolo;	
	
	@NotNull
	@JsonProperty(value = "idEnte", required = true)
	private Long idEnte;
	
	@JsonProperty(value = "mansione", required = true)
	private String mansione;
}