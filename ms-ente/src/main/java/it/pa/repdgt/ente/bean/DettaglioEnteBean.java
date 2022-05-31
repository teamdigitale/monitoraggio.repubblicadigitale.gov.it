package it.pa.repdgt.ente.bean;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DettaglioEnteBean {
	private Long id;
	private String nome;
	private String nomeBreve;
	private String tipologia;
	private String piva;
	private String sedeLegale;
	private String IndirizzoPec;
}
