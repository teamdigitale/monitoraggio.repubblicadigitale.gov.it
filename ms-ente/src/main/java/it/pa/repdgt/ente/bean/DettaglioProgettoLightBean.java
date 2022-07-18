package it.pa.repdgt.ente.bean;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "DettaglioProgettoLight")
public class DettaglioProgettoLightBean {

	private Long id;
	private String nomeBreve;
}
