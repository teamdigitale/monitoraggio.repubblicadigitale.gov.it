package it.pa.repdgt.programmaprogetto.bean;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DettaglioSediBean {
	private Long id;
	private String nome;
	private String ruoloEnte;
	private String serviziErogati;
	private String enteDiRiferimento;
	private int nrFacilitatori;
	private String stato;
}
