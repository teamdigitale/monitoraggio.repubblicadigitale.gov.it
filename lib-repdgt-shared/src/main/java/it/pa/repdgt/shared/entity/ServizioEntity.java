package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "servizio")
@Setter
@Getter
public class ServizioEntity implements Serializable {
	private static final long serialVersionUID = -7295461834594252761L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "NOME")
	private String nome;

	@Column(name = "ID_TEMPLATE_Q3_COMPILATO")
	private String idTemplateCompilatoQ3;

	@Column(name = "ID_QUESTIONARIO_TEMPLATE_SNAPSHOT")
	private String idQuestionarioTemplateSnapshot;

	@OneToMany(mappedBy = "servizio", targetEntity = TipologiaServizioEntity.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private List<TipologiaServizioEntity> listaTipologiaServizi;

	@Temporal(value = TemporalType.DATE)
	@Column(name = "DATA_SERVIZIO")
	private Date dataServizio;

	@Column(name = "DURATA_SERVIZIO")
	private String durataServizio;

	private EnteSedeProgettoFacilitatoreKey idEnteSedeProgettoFacilitatore;

	@Column(name = "STATO")
	private String stato;

	@Column(name = "TIPOLOGIA_SERVIZIO")
	private String tipologiaServizio;

	@Temporal(value = TemporalType.TIMESTAMP)
	@CreatedDate
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@LastModifiedDate
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}