package it.pa.repdgt.ente.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.ente.dto.EnteDto;
import lombok.Getter;
import lombok.Setter;

@JsonInclude(value = Include.NON_NULL)
@JsonRootName(value = "EntiPaginatiResource")
@Setter
@Getter
public class ListaEntiPaginatiResource implements Serializable {
	private static final long serialVersionUID = 3941930693089722135L;

	@JsonProperty(value = "enti")
	private List<EnteDto> enti;
	
	@JsonProperty(value = "numeroPagine")
	private Integer numeroPagine;
	
	@JsonProperty(value = "numeroTotaleElementi")
	private Long numeroTotaleElementi;
}