package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ente_sede_progetto")
@Setter
@Getter
public class EnteSedeProgetto implements Serializable {
	private static final long serialVersionUID = 7753694933342752130L;

	@EmbeddedId
	private EnteSedeProgettoKey id;

	@MapsId(value = "idEnte")
	@ManyToOne(targetEntity = EnteEntity.class)
	@JoinColumn(name = "ID_ENTE", referencedColumnName = "ID")
	private EnteEntity ente;
	
	@MapsId(value = "idSede")
	@ManyToOne(targetEntity = SedeEntity.class)
	@JoinColumn(name = "ID_SEDE", referencedColumnName = "ID")
	private SedeEntity sede;
	
	@MapsId(value = "idProgetto")
	@ManyToOne(targetEntity = ProgettoEntity.class)
	@JoinColumn(name = "ID_PROGETTO", referencedColumnName = "ID")
	private ProgettoEntity progetto;
	
	@Column(name = "RUOLO_ENTE")
	private String ruoloEnte;
	
	@Column(name = "STATO_SEDE")
	private String statoSede;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ATTIVAZIONE_SEDE")
	private Date dataAttivazioneSede;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_TERMINAZIONE_SEDE")
	private Date dataTerminazioneSede;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}