package it.pa.repdgt.ente.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NuovoEnteRequest implements Serializable {
	private static final long serialVersionUID = 3778729425460145918L;

	@NotBlank
	@JsonProperty(value = "nome", required = true)
	private String nome;
	
	@NotBlank
	@JsonProperty(value = "nomeBreve", required = true)
	private String nomeBreve;
	
	@NotNull
	@JsonProperty(value = "tipologia", required = true)
	private String Tipologia;
	
	@NotNull
	@Pattern(regexp = "[0-9]{11}")
	@JsonProperty(value = "piva", required = true)
	private String partitaIva;
	
	@JsonProperty(value = "sedeLegale", required = true)
	private String sedeLegale;
	
	@JsonProperty(value = "indirizzoPec")
	private String indirizzoPec;
}