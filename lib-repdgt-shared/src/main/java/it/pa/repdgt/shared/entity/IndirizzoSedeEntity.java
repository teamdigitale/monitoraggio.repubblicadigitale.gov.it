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

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "indirizzo_sede")
@Setter
@Getter
public class IndirizzoSedeEntity implements Serializable {
	private static final long serialVersionUID = 4557278171360251665L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "SEDE_ID")
	private Long idSede;
	
	@Column(name = "NAZIONE")
	private String nazione;
	
	@Column(name = "PROVINCIA")
	private String provincia;
	
	@Column(name = "COMUNE")
	private String comune;
	
	@Column(name = "VIA")
	private String via;
	
	@Column(name = "CIVICO")
	private String civico;
	
	@Column(name = "CAP")
	private String cap;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}