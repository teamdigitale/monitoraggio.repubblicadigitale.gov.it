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
	private Integer annoDiNascita;
	private String titoloDiStudio;
	private String occupazione;
	private String cittadinanza;
	private String comuneDiDomicilio;
	private String categoriaFragili;
	private String email;
	private String prefissoTelefono;
	private String numeroDiCellulare;
	private String telefono;
	private String tipoConferimentoConsenso;
	private Date dataConferimentoConsenso;
}