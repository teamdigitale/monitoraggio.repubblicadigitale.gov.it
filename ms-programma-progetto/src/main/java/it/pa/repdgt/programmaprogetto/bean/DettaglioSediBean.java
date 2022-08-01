package it.pa.repdgt.programmaprogetto.bean;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "DettaglioSede")
public class DettaglioSediBean {
	private Long id;
	private String nome;
	private String ruoloEnte;
	private String serviziErogati;
	private Long identeDiRiferimento;
	private String enteDiRiferimento;
	private int nrFacilitatori;
	private String stato;
}