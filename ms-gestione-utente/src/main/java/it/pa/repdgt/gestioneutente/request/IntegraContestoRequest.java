package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonRootName(value = "integraContesto")
public class IntegraContestoRequest implements Serializable {
	private static final long serialVersionUID = -6654227879250469320L;
	
	@JsonProperty(value = "codiceFiscale")
	@NotBlank
	private String cfUtenteLoggato;
	
	@JsonProperty(value = "email")
	@Email
	private String email;

	@JsonProperty(value = "telefono")
	@NotBlank
	private String telefono;
	
	@JsonProperty(value = "bio")
	private String bio;
	
	@JsonProperty(value = "tipoContratto")
	private String tipoContratto;

	@JsonProperty(value = "abilitazioneConsensoTrattamentoDatiPersonali")
	@NotNull
	private Boolean abilitazioneConsensoTrattamentoDatiPersonali;
}