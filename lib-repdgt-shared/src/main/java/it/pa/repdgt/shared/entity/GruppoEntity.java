package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "gruppo")
@Setter
@Getter
public class GruppoEntity implements Serializable {
	private static final long serialVersionUID = -5250146895335449710L;

	@Id
	@Column(name = "CODICE")
	public String codice;

	@Column(name = "DESCRIZIONE")
	public String descrizione;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "GRUPPO_X_PERMESSO",
		joinColumns = @JoinColumn(name = "GRUPPO_CODICE",  referencedColumnName = "CODICE"),
		inverseJoinColumns = @JoinColumn(name = "PERMESSO_ID", referencedColumnName = "ID")
	)
	private List<PermessoEntity> permessi = new ArrayList<>();
	
	public List<PermessoEntity> addPermesso(PermessoEntity permesso) {
		this.permessi.add(permesso);
		return this.permessi;
	}

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
}