package it.pa.repdgt.programmaprogetto.resource;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.shared.entityenum.PolicyEnum;
import lombok.Getter;
import lombok.Setter;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
public class ProgrammaLightResource implements Serializable {
	private static final long serialVersionUID = -49938662136031743L;
	
	@JsonProperty(value = "id")
	private Long id;
	
	@JsonProperty(value = "nome")
	private String nome;
	
	@JsonProperty(value = "nomeBreve")
	private String nomeBreve;
	
	@JsonProperty(value = "stato")
	private String stato;
	
	@JsonProperty(value = "policy")
	private PolicyEnum policy;
	
	@JsonProperty(value = "nomeEnteGestore")
	private String nomeEnteGestore;
	
	@JsonProperty(value = "codice")
	private String codice;
}