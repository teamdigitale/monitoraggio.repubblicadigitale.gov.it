package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NuovoUtenteRequest implements Serializable {
	private static final long serialVersionUID = -455726924198610378L;
	
	@NotNull(message = "Codice fiscale deve essere valorizzato")
	@Pattern(regexp = "^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1}$", message = "codice fiscale non valido")
	@JsonProperty(value = "codiceFiscale")
	private String codiceFiscale;
	
	@NotBlank(message = "Nome deve essere valorizzato")
	@JsonProperty(value = "nome")
	private String nome;
	
	@NotBlank(message = "Cognome deve essere valorizzato")
	@JsonProperty(value = "cognome")
	private String cognome;
	
	@NotBlank(message = "Ruolo deve essere valorizzato")
	@JsonProperty(value = "ruolo")
	private String ruolo;
	
	@NotBlank(message = "Email deve essere valorizzato")
	@Email(message = "Email non valida")
	@JsonProperty(value = "email")
	private String email;
	
	@JsonProperty(value = "telefono")
	private String telefono;
	
	@JsonProperty(value = "mansione")
	private String mansione;
	
	@JsonProperty(value = "tipoContratto")
	private String tipoContratto;
}