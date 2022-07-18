package it.pa.repdgt.programmaprogetto.bean;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "DettaglioProgrammaLight")
public class DettaglioProgrammaLightBean {
	
	private Long id;
	private String codice;
	private String nomeBreve;
	
}
