package it.pa.repdgt.gestioneutente.resource;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@JsonRootName(value = "ruoli")
@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
public class RuoloLightResource implements Serializable {
	private static final long serialVersionUID = 8945043662754242185L;
	
	@JsonProperty(value = "codiceRuolo")
	private String codiceRuolo;

	@JsonProperty(value = "nomeRuolo")
	private String nomeRuolo;
	
	@JsonProperty(value = "tipologiaRuolo")
	private String tipologiaRuolo;

	@JsonProperty(value = "modificabile")
	private Boolean modificabile;
}