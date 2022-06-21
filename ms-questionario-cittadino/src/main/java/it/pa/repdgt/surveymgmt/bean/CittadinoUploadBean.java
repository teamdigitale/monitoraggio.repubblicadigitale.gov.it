package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;

import javax.validation.constraints.Email;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CittadinoUploadBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private String codiceFiscale;
	private String nome;
	private String cognome;
	private String tipoDocumento;
	private String numeroDocumento;
	private String genere;
	private String annoNascita;
	private String titoloStudio;
	private String statoOccupazionale;
	private String cittadinanza;
	private String comuneDomicilio;
	private String categoriaFragili;	
	@Email
	private String email;
	private String prefisso;
	private String numeroCellulare;
	private String telefono;
	private String esitoUpload;
	
	public CittadinoUploadBean(String codiceFiscale, String nome, String cognome, String tipoDocumento,
			String numeroDocumento, String genere, String annoNascita, String titoloStudio, String statoOccupazionale,
			String cittadinanza, String comuneDomicilio, String categoriaFragili, String email, String prefisso,
			String numeroCellulare, String telefono) {
		super();
		this.codiceFiscale = codiceFiscale;
		this.nome = nome;
		this.cognome = cognome;
		this.tipoDocumento = tipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.genere = genere;
		this.annoNascita = annoNascita;
		this.titoloStudio = titoloStudio;
		this.statoOccupazionale = statoOccupazionale;
		this.cittadinanza = cittadinanza;
		this.comuneDomicilio = comuneDomicilio;
		this.categoriaFragili = categoriaFragili;
		this.email = email;
		this.prefisso = prefisso;
		this.numeroCellulare = numeroCellulare;
		this.telefono = telefono;
	}
}