package it.pa.repdgt.ente.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReferenteDelegatoPartnerRequest{
	
	@NotBlank
	@JsonProperty(value = "cfUtente", required = true)
	private String codiceFiscaleUtente;

	@NotNull
	@JsonProperty(value = "idProgetto", required = true)
	private Long idProgetto;
	
	@NotNull
	@JsonProperty(value = "idEntePartner", required = true)
	private Long idEntePartner;
	
	//Referente o Delegato (REPP o DEPP)
	@NotNull
	@JsonProperty(value = "codiceRuolo", required = true)
	private String codiceRuolo;
	
	@JsonProperty(value = "mansione", required = true)
	private String mansione;
	
}
