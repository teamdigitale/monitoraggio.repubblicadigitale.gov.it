package it.pa.repdgt.ente.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnteSedeProgettoFacilitatoreRequest{
	
	@NotBlank
	@JsonProperty(value = "cfUtente", required = true)
	private String codiceFiscaleUtente;

	@NotNull
	@JsonProperty(value = "idProgetto", required = true)
	private Long idProgetto;
	
	@JsonProperty(value = "tipoContratto", required = true)
	private String tipoContratto;
	
	@JsonProperty(value = "idSede", required = true)
	private Long idSede;
	
	@JsonProperty(value = "idEnte", required = true)
	private Long idEnte;
}