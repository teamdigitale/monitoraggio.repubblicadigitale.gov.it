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
public class ServizioResource implements Serializable {
	private static final long serialVersionUID = -661976690923589119L;

	@JsonProperty(value = "id")
	private String id;

	@JsonProperty(value = "nome")
	private String nomeServizio;

	@JsonProperty(value = "tipologiaServizio")
	private String tipologiaServizio;

	@JsonProperty(value = "data")
	private String dataServizio;
	
	@JsonProperty(value = "durataServizio")
	private String durataServizio;
	
	// nome e cognome del facilitatore
	@JsonProperty(value = "facilitatore")
	private String nominativoFacilitatore;
	
	@JsonProperty(value = "stato")
	private String stato;
}