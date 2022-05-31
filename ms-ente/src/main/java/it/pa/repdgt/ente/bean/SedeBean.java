package it.pa.repdgt.ente.bean;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SedeBean {
	Long id;
	String nome;
	int nrFacilitatori;
	String serviziErogati;
	String stato;
}
