package it.pa.repdgt.shared.entity.light;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import it.pa.repdgt.shared.entityenum.PolicyEnum;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "PROGRAMMA")
@Setter
@Getter
public class ProgrammaLightEntity implements Serializable {
	private static final long serialVersionUID = 4117753743164181935L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "NOME", nullable = false)
	private String nome;
	
	@Column(name = "POLICY")
	@Enumerated(value = EnumType.STRING)
	private PolicyEnum policy;
	
	@Column(name = "DATA_INIZIO_PROGRAMMA")
	private Date dataInizioProgramma;
	
	@Column(name = "DATA_FINE_PROGRAMMA")
	private Date dataFineProgramma;
	
	@Column(name = "STATO")
	private String stato;
}