package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AggiornaUtenteRequest implements Serializable {
	private static final long serialVersionUID = -455726924198610378L;
	
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
