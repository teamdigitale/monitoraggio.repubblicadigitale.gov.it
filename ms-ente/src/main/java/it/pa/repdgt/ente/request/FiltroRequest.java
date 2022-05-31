package it.pa.repdgt.ente.request;

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
	
	@JsonProperty(value = "profili")
	private List<String> profili;
	
	@JsonProperty(value = "idsProgrammi")
	private List<String> idsProgrammi;
	
	@JsonProperty(value = "idsProgetti")
	private List<String> idsProgetti;
}