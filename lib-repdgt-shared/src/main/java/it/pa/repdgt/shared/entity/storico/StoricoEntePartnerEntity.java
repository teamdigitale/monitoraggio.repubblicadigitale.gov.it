package it.pa.repdgt.shared.entity.storico;

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
@Table(name = "STORICO_ENTE_PARTNER")
@Setter
@Getter
public class StoricoEntePartnerEntity implements Serializable {
	private static final long serialVersionUID = -767304162567037316L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "ENTE_ID", nullable = false)
	private Long idEnte;
	
	@Column(name = "PROGETTO_ID", nullable = false)
	private Long idProgetto;
	
	@Column(name = "STATO", nullable = false)
	private String stato;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE", nullable = false)
	private Date dataOraCreazione;
}