package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import it.pa.repdgt.shared.entity.key.ServizioCittadinoKey;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "servizio_x_cittadino")
@Setter
@Getter
public class ServizioXCittadinoEntity implements Serializable {
	private static final long serialVersionUID = -7295461834594252761L;

	@EmbeddedId
	private ServizioCittadinoKey id;

	@Temporal(value = TemporalType.TIMESTAMP)
	@CreatedDate
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@LastModifiedDate
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}