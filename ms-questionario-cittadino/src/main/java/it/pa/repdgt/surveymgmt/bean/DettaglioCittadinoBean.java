package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DettaglioCittadinoBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private String codiceFiscale;
	private String nome;
	private String cognome;
	private String tipoDocumento;
	private String numeroDocumento;
	private String genere;
	private Integer annoNascita;
	private String titoloStudio;
	private String statoOccupazionale;
	private String cittadinanza;
	private String comuneDomicilio;
	private String categoriaFragili;
	private String email;
	private String prefisso;
	private String numeroCellulare;
	private String telefono;
	private String tipoConferimentoConsenso;
	private Date dataConferimentoConsenso;
}