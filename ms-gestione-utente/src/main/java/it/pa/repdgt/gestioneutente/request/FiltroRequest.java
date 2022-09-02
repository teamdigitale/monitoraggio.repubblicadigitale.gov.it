package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FiltroRequest implements Serializable {
	private static final long serialVersionUID = -7482749406950994870L;

	@JsonProperty(value = "criterioRicerca")
	private String criterioRicerca;
	
	@JsonProperty(value = "ruoli")
	private List<String> ruoli;
	
	@JsonProperty(value = "stati")
	private List<String> stati;
}