package it.pa.repdgt.ente.resource;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@JsonRootName(value = "sedeResource")
@JsonInclude(value = Include.NON_NULL)
@Setter
@Getter
public class SedeResource implements Serializable {
	private static final long serialVersionUID = -2347417439487402350L;

	@JsonProperty(value = "id")
	private Long id;
	
	@JsonProperty(value = "nome")
	private String nome;
}