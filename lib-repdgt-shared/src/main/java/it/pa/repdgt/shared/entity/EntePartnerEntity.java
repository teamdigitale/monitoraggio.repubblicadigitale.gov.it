package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ente_partner")
@NoArgsConstructor
@Setter
@Getter
public class EntePartnerEntity implements Serializable {
	private static final long serialVersionUID = 7502868301968551516L;

	@EmbeddedId
	private EntePartnerKey id;

	@Column(name = "STATO_ENTE_PARTNER")
	private String statoEntePartner;
	
	@Column(name = "TERMINATO_SINGOLARMENTE")
	private Boolean terminatoSingolarmente;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}