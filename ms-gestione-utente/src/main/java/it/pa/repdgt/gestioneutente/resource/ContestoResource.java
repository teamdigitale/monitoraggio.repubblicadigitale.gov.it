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
public class ContestoResource implements Serializable {
	private static final long serialVersionUID = 8956013718778000343L;
	
	@JsonProperty(value = "id")
	private Long id;
	
	@JsonProperty(value = "nome")
	private String nome;
	
	@JsonProperty(value = "cognome")
	private String cognome;
	
	@JsonProperty(value = "email")
	private String email;

	@JsonProperty(value = "telefono")
	private String numeroCellulare;
	
	@JsonProperty(value = "codiceFiscale")
	private String codiceFiscale;
	
	@JsonProperty(value = "mostraBio")
	private boolean mostraBio;
	
	// bio/mansione
	@JsonProperty(value = "bio")
	private String bio;
	
	@JsonProperty(value = "mostraTipoContratto")
	private boolean mostraTipoContratto;
	
	@JsonProperty(value = "tipoContratto")
	private String tipoContratto;
	
	@JsonProperty(value = "ruoli")
	private List<RuoloResource> ruoli;
	
	@JsonProperty(value = "stato")
	private String stato;
	
	@JsonProperty(value = "immagineProfilo")
	private String immagineProfilo;
	
	// combinazione Ruolo Programma
	@JsonProperty(value = "profiliUtente")
	List<RuoloProgrammaResource> profili;
	
	@JsonProperty(value = "integrazione")
	private Boolean integrazione;
}