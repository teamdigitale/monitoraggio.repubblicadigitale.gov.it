package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "integrazioni_utente")
@Setter
@Getter
public class IntegrazioniUtenteEntity implements Serializable { 
	private static final long serialVersionUID = -2440129724556580907L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@OneToOne
 	@JoinColumn(name = "UTENTE_ID", referencedColumnName = "ID")
	@JsonIgnore
	private UtenteEntity utente;

	@Column(name = "UTENTE_REGISTRATO_WORKDOCS", nullable = false)
	private Boolean utenteRegistratoInWorkdocs;
	
	@Column(name = "ID_UTENTE_WORKDOCS")
	private String idUtenteWorkdocs;
	
	@Column(name = "UTENTE_REGISTRATO_ROCKETCHAT", nullable = false)
	private Boolean utenteRegistratoInRocketChat;
	
	@Column(name = "ID_UTENTE_ROCKETCHAT")
	private String idUtenteRocketChat;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}