package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "utente_x_ruolo")
@Setter
@Getter
public class UtenteXRuolo implements Serializable {
	private static final long serialVersionUID = 7753694933342752130L;

	@EmbeddedId
	private UtenteXRuoloKey id;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}