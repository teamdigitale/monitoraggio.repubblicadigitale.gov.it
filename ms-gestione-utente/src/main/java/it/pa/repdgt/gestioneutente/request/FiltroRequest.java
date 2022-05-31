package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FiltroRequest implements Serializable {
	private static final long serialVersionUID = -7482749406950994870L;

	@JsonProperty(value = "criterioRicerca")
	private String criterioRicerca;
	
	@JsonProperty(value = "ruolo")
	private String ruolo;
	
	@JsonProperty(value = "stato")
	private String stato;
}