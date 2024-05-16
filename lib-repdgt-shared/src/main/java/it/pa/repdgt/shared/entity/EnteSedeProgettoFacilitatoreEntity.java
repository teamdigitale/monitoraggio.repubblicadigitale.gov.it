package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import lombok.*;

@Entity
@Table(name = "ente_sede_progetto_facilitatore")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class EnteSedeProgettoFacilitatoreEntity implements Serializable {
	private static final long serialVersionUID = -4733831100623543478L;

	@EmbeddedId
	private EnteSedeProgettoFacilitatoreKey id;

	// FACILITATORE O VOLONTARIO
	@Column(name = "RUOLO_UTENTE")
	private String ruoloUtente;

	@Column(name = "STATO_UTENTE")
	private String statoUtente;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_ATTIVAZIONE")
	private Date dataOraAttivazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_TERMINAZIONE")
	private Date dataOraTerminazione;
}