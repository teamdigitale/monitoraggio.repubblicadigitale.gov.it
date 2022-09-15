package it.pa.repdgt.programmaprogetto.bean;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "DettaglioProgrammaLight")
public class DettaglioProgrammaLightBean implements Serializable {
	private static final long serialVersionUID = -7072217882087791303L;
	
	private Long id;
	private String codice;
	private String nomeBreve;
	private Date dataInizio;
	private Date dataFine;
	private String stato;
}