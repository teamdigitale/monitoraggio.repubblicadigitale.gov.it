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

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sede")
@Setter
@Getter
public class SedeEntity implements Serializable {
	private static final long serialVersionUID = -5906737112762249324L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "NOME", nullable = false, unique = true)
	private String nome;

	@Column(name = "DESCRIZIONE")
	private String descrizione;

	@Column(name = "SERVIZI_EROGATI")
	private String serviziErogati;

	@Column(name = "NAZIONE")
	private String nazione;

	@Column(name = "PROVINCIA")
	private String provincia;

	@Column(name = "REGIONE")
	private String regione;

	@Column(name = "COMUNE")
	private String comune;

	@Column(name = "VIA")
	private String via;

	@Column(name = "CIVICO")
	private String civico;

	@Column(name = "CAP")
	private String cap;

	@Column(name = "ITINERE")
	private Boolean itinere = false;

	@Column(name = "AREA")
	private String area;

	@Column(name = "COORDINATE")
	private String coordinate;

	@Temporal(value = TemporalType.TIMESTAMP)
	@CreatedDate
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@LastModifiedDate
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}