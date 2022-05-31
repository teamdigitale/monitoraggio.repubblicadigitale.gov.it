package it.pa.repdgt.ente.resource;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(value = Include.NON_NULL)
@Setter
@Getter
public class EnteGestoreResource implements Serializable {
	private static final long serialVersionUID = -7134290275509462312L;

	@JsonProperty(value = "id")
	private Long id;
	
	@JsonProperty(value = "nome")
	private String nome;
	
	@JsonProperty(value = "stato")
	private String stato;
}