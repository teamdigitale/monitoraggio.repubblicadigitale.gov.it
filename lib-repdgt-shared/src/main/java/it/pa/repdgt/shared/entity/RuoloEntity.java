package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

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
@Table(name = "ruolo")
@Setter
@Getter
public class RuoloEntity implements Serializable {
	private static final long serialVersionUID = 3202201467169842152L;

	@Id
	@Column(name = "CODICE")
	private String codice;
	
	@Column(name = "NOME", nullable = false, unique = true)
	private String nome;
	
	@Column(name = "PREDEFINITO", nullable = false)
	private Boolean predefinito;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "RUOLO_X_GRUPPO",
		joinColumns = @JoinColumn(name = "RUOLO_CODICE",  referencedColumnName = "CODICE"),
		inverseJoinColumns = @JoinColumn(name = "GRUPPO_CODICE", referencedColumnName = "CODICE")
	)
	private List<GruppoEntity> gruppi = new ArrayList<>();
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
	
	@Column(name = "STATO")
	private String stato;

	public List<GruppoEntity> aggiungiGruppo(GruppoEntity gruppo) {
		this.gruppi.add(gruppo);
		return this.gruppi;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(codice);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RuoloEntity other = (RuoloEntity) obj;
		return Objects.equals(codice, other.codice);
	}
}