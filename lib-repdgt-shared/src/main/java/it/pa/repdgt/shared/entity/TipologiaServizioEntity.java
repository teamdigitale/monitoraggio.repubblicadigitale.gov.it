package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "tipologia_servizio")
public class TipologiaServizioEntity implements Serializable {
	private static final long serialVersionUID = -6310179790779394657L;

	@Id
	@JsonIgnore
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "TITOLO", nullable = true)
	private String titolo;

	@JsonIgnore
	@ManyToOne(targetEntity = ServizioEntity.class)
	@JoinColumn(name = "SERVIZIO_ID", referencedColumnName = "ID")
	private ServizioEntity servizio;

	@JsonIgnore
	@Temporal(value = TemporalType.TIMESTAMP)
	@CreatedDate
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@JsonIgnore
	@Temporal(value = TemporalType.TIMESTAMP)
	@LastModifiedDate
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}