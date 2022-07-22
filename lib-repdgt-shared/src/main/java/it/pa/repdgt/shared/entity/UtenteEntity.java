package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Email;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "utente")
@Setter
@Getter
public class UtenteEntity implements Serializable {
	private static final long serialVersionUID = -1466364242826049157L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "CODICE_FISCALE", nullable = false, unique = true, length = 16)
	private String codiceFiscale;
	
	@Column(name = "NOME", nullable = true)
	private String nome;
	
	@Column(name = "COGNOME", nullable = true)
	private String cognome;
	
	@Column(name = "EMAIL", nullable = false)
	@Email
	private String email;
	
	@Column(name = "TELEFONO", nullable = true)
	private String telefono;
	
	@Column(name = "MANSIONE", nullable = true)
	private String mansione;
	
	@Column(name = "CONSENSO_DATI", nullable = true)
	private Boolean abilitazioneConsensoTrammentoDati;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CONSENSO_DATI")
	private Date dataOraAbilitazioneConsensoDati;

	@Column(name = "TIPO_CONTRATTO", nullable = true)
	private String tipoContratto;
	
	@ManyToMany(fetch = FetchType.EAGER, targetEntity = RuoloEntity.class)
	@JoinTable(
		name = "UTENTE_X_RUOLO", 
		joinColumns = @JoinColumn(name = "UTENTE_ID", referencedColumnName = "CODICE_FISCALE"), 
		inverseJoinColumns = @JoinColumn(name = "RUOLO_CODICE", referencedColumnName = "CODICE")
	)
	private List<RuoloEntity> ruoli = new ArrayList<>();
	
	@Column(name = "STATO", nullable = false)
	private String stato;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
	
	@Column(name = "INTEGRAZIONE")
	private Boolean integrazione;
}