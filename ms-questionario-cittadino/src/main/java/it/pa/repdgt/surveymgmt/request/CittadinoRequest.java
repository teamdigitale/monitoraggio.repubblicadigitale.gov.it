package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CittadinoRequest implements Serializable {
	private static final long serialVersionUID = 443289012578169806L;

	@JsonProperty(value = "nome")
	@NotBlank
	private String nome;

	@JsonProperty(value = "cognome")
	@NotBlank
	private String cognome;

	@JsonProperty(value = "codiceFiscale")
	private String codiceFiscale;
	
	@JsonProperty(value = "codiceFiscaleNonDisponibile")
	private Boolean codiceFiscaleNonDisponibile;
	
	@JsonProperty(value = "tipoDocumento")
	private String tipoDocumento;
	
	@JsonProperty(value = "numeroDocumento")
	private String numeroDocumento;

	@JsonProperty(value = "genere")
	private String genere;
	
	@JsonProperty(value = "annoNascita")
	private Integer annoNascita;
	
	@JsonProperty(value = "titoloStudio")
	private String titoloStudio;
	
	@JsonProperty(value = "statoOccupazionale")
	private String statoOccupazionale;
	
	@JsonProperty(value = "cittadinanza")
	private String cittadinanza;
	
	@JsonProperty(value = "comuneDomicilio")
	private String comuneDomicilio;
	
	@JsonProperty(value = "categoriaFragili")
	private String categoriaFragili;
	
	@JsonProperty(value = "email")
	private String email;
	
	@JsonProperty(value = "prefisso")
	private String prefisso;
	
	@JsonProperty(value = "numeroCellulare")
	private String numeroCellulare;
	
	@JsonProperty(value = "telefono")
	private String telefono;
	
	@JsonProperty(value = "questionarioQ1")
	private String questionarioQ1;
}