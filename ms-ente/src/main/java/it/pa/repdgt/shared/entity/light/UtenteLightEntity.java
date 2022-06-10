package it.pa.repdgt.shared.entity.light;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "UTENTE")
@Setter
@Getter
public class UtenteLightEntity implements Serializable {
	private static final long serialVersionUID = 4567791769914288690L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "NOME")
	private String nome;

	@Column(name = "COGNOME")
	private String cognome;
	
	@Column(name = "EMAIL")
	private String email;
	
	@Column(name = "CODICE_FISCALE")
	private String codiceFiscale;
	
	@Column(name = "TELEFONO")
	private String telefono;
	
	@Column(name = "MANSIONE")
	private String mansione;
	
	@Column(name = "TIPO_CONTRATTO")
	private String tipoContratto;
}