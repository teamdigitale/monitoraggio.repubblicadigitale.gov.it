package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Email;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cittadino")
@Setter
@Getter
public class CittadinoEntity implements Serializable { 
	private static final long serialVersionUID = -3997184755252624867L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "CODICE_FISCALE")
	private String codiceFiscale;
	
	@Column(name = "NOME", nullable = false)
	private String nome;
	
	@Column(name = "COGNOME", nullable = false)
	private String cognome;
	
	@Column(name = "TIPO_DOCUMENTO")
	private String tipoDocumento;

	@Column(name = "NUM_DOCUMENTO", unique = true)
	private String numeroDocumento;

	@Column(name = "GENERE", nullable = true)
	private String genere;
	
	@Column(name = "ANNO_DI_NASCITA", nullable = true)
	private String annoDiNascita;
	
	@Column(name = "TITOLO_DI_STUDIO", nullable = true)
	private String titoloDiStudio;
	
	@Column(name = "OCCUPAZIONE", nullable = true)
	private String occupazione;
	
	@Column(name = "CITTADINANZA", nullable = true)
	private String cittadinanza;
	
	@Column(name = "COMUNE_DI_DOMICILIO", nullable = true)
	private String comuneDiDomicilio;
	
	@Column(name = "CATEGORIA_FRAGILI", nullable = true)
	private String categoriaFragili;
	
	@Column(name = "EMAIL", nullable = false, unique = true)
	@Email
	private String email;
	
	@Column(name = "PREFISSO", nullable = true)
	private String prefissoTelefono;
	
	@Column(name = "NUMERO_DI_CELLULARE", nullable = true)
	private String numeroDiCellulare;
	
	@Column(name = "TELEFONO", nullable = true)
	private String telefono;
	
	@Column(name = "TIPO_CONFERIMENTO_CONSENSO", nullable = true)
	private String tipoConferimentoConsenso;
	
	@Column(name = "DATA_CONFERIMENTO_CONSENSO", nullable = true)
	@Temporal(TemporalType.DATE)
	private Date dataConferimentoConsenso;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}