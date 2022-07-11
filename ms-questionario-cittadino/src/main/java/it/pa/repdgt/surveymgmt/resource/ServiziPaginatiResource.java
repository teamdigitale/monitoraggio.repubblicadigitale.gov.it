package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "serviziResource")
@NoArgsConstructor
@AllArgsConstructor
public class ServiziPaginatiResource implements Serializable {
	private static final long serialVersionUID = -2324352133478003836L;

	@JsonProperty(value = "servizi")
	private List<ServizioResource> serviziResource; 
	
	@JsonProperty(value = "numeroPagine")
	private Integer numeroPagine;
	
	@JsonProperty(value = "numeroTotaleElementi")
	private Long numeroTotaleElementi;
}