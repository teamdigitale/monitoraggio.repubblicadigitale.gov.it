package it.pa.repdgt.programmaprogetto.bean;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "DettaglioEntePartner")
public class DettaglioEntiPartnerBean {
	private Long id;
	private String nome;
	private List<String> referenti;
	private String stato;
}