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
	
	@Column(name = "CODICE_FISCALE", nullable = false, unique = true)
	private String codiceFiscale;
	
	@Column(name = "NOME", nullable = false)
	private String nome;
	
	@Column(name = "COGNOME", nullable = false)
	private String cognome;
	
	@Column(name = "ETA", nullable = true)
	private Integer eta;
	
	@Column(name = "TIPO_DOCUMENTO", nullable = false)
	private String tipoDocumento;

	@Column(name = "NUM_DOCUMENTO", nullable = false, unique = true)
	private String numeroDocumento;

	@Column(name = "NAZIONALITA", nullable = true)
	private String nazionalita;
	
	@Column(name = "TITOLO_DI_STUDIO", nullable = true)
	private String titoloDiStudio;
	
	@Column(name = "OCCUPAZIONE", nullable = true)
	private String occupazione;
	
	@Column(name = "EMAIL", nullable = false, unique = true)
	@Email
	private String email;
	
	@Column(name = "PREFISSO", nullable = true)
	private String prefissoTelefono;
	
	@Column(name = "TELEFONO", nullable = true)
	private String telefono;
	
	@Column(name = "DATA_CONFERIMENTO_CONSENSO", nullable = true)
	@Temporal(TemporalType.DATE)
	private Date dataConferimentoConsenso;
	
	@Column(name = "TIPO_CONFERIMENTO_CONSENSO", nullable = true)
	private String tipoConferimentoConsenso;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}