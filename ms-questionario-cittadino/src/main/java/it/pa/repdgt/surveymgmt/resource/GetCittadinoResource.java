package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(value = Include.NON_NULL)
public class GetCittadinoResource implements Serializable {
	private static final long serialVersionUID = -661976690923589119L;

	@JsonProperty(value = "idCittadino")
	private Long IdCittadino;
	
	@JsonProperty(value = "nome")
	private String nome;
	
	@JsonProperty(value = "cognome")
	private String cognome;
	
	@JsonProperty(value = "codiceFiscale")
	private String codiceFiscale;
	
	@JsonProperty(value = "email")
	private String email;
	
	@JsonProperty(value = "telefono")
	private String telefono;
	
	
}