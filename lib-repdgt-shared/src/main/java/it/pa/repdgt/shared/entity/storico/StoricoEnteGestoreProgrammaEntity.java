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
@Table(name = "STORICO_ENTE_GESTORE_PROGRAMMA")
@Setter
@Getter
public class StoricoEnteGestoreProgrammaEntity implements Serializable {
	private static final long serialVersionUID = -1312484717572856055L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "PROGRAMMA_ID", nullable = false)
	private Long idProgramma;

	@Column(name = "ENTE_ID", nullable = false)
	private Long idEnte;
	
	@Column(name = "STATO", nullable = false)
	private String stato;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE", nullable = false)
	private Date dataOraCreazione;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ATTIVAZIONE_ENTE", nullable = false)
	private Date dataAttivazioneEnte;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_TERMINAZIONE", nullable = true)
	private Date dataOraTerminazione;
}
