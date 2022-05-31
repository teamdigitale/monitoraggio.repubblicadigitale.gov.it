package it.pa.repdgt.gestioneutente.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
public class UtenteLightResource implements Serializable{
	private static final long serialVersionUID = 8956013718778000343L;
	
	@JsonProperty(value = "id")
	private Long id;
	
	@JsonProperty(value = "nome")
	private String nomeCompleto;
	
	@JsonProperty(value = "ruoli")
	private List<RuoloLightResource> ruoli;
	
	@JsonProperty(value = "stato")
	private String stato;

}
