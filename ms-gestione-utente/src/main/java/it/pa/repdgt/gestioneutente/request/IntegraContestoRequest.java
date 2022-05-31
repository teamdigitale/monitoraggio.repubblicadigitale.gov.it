package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonRootName(value = "integraContesto")
public class IntegraContestoRequest implements Serializable {
	private static final long serialVersionUID = -6654227879250469320L;

	@JsonProperty(value = "nome")
	@NotBlank
	private String nome;
	
	@JsonProperty(value = "cognome")
	@NotBlank
	private String cognome;
	
	@JsonProperty(value = "email")
	@NotBlank
	private String email;

	@JsonProperty(value = "numero cellulare")
	@NotBlank
	private String numeroCellulare;
	
	@JsonProperty(value = "codiceFiscale")
	@NotBlank
	private String codiceFiscale;
}
