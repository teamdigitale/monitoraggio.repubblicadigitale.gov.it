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
@Setter
@Getter
@Table(name = "ente")
public class EnteEntity implements Serializable {
	private static final long serialVersionUID = -6310179790779394657L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "PARTITA_IVA", nullable = true, unique = true)
	private String piva;

	@Column(name = "NOME", nullable = true, unique = true)
	private String nome;
	
	@Column(name = "NOME_BREVE", nullable = false)
	private String nomeBreve;

	@Column(name = "TIPOLOGIA", nullable = true)
	private String tipologia;
	
	@Column(name = "SEDE_LEGALE", nullable = true)
	private String sedeLegale;
	
	@Column(name = "INDIRIZZO_PEC", nullable = true)
	private String indirizzoPec;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}