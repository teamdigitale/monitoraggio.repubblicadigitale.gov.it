package it.pa.repdgt.ente.bean;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SedeBean {
	private Long id;
	private String nome;
	private int nrFacilitatori;
	private String serviziErogati;
	private String stato;
	private boolean associatoAUtente;
}