package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.time.LocalTime;
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
@Table(name = "indirizzo_sede_fascia_oraria")
@Setter
@Getter
public class IndirizzoSedeFasciaOrariaEntity implements Serializable {
	private static final long serialVersionUID = -4335386214547725888L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "INDIRIZZO_SEDE_ID")
	private Long idIndirizzoSede;
	
	@Column(name = "GIORNO_APERTURA", nullable = false)
	private String giornoAperturaSede;
	
	@Column(name = "ORARIO_APERTURA", nullable = false)
	private LocalTime orarioAperuturaSede;
	
	@Column(name = "ORARIO_CHIUSURA", nullable = false)
	private LocalTime orarioChiusuraSede;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE", nullable = false)
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO", nullable = true)
	private Date dataOraAggiornamento;
}