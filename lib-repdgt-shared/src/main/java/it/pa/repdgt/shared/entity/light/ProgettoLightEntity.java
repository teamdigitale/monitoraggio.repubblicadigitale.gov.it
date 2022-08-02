package it.pa.repdgt.shared.entity.light;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "PROGETTO")
@Setter
@Getter
public class ProgettoLightEntity implements Serializable {
	private static final long serialVersionUID = 4567791769914288690L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "NOME", nullable = false, length = 199)
	private String nome;

	@Column(name = "STATO")
	private String stato;

	@Transient
	private Boolean associatoAUtente;
}