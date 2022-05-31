package it.pa.repdgt.gestioneutente.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(Include.NON_NULL)
@Setter
@Getter
public class DettaglioGruppiBean {
	private String codice;
	private String descrizione;
}
