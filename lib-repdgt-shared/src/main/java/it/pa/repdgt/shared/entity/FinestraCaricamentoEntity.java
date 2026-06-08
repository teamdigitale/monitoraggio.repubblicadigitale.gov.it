package it.pa.repdgt.shared.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "finestra_caricamento")
@Getter
@Setter
public class FinestraCaricamentoEntity {

	@Id
	@Column(name = "id")
	private Integer id;

	@Temporal(TemporalType.DATE)
	@Column(name = "data_inizio", nullable = false)
	private Date dataInizio;

	@Temporal(TemporalType.DATE)
	@Column(name = "data_fine")
	private Date dataFine;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "data_aggiornamento", nullable = false)
	private Date dataAggiornamento;
}
