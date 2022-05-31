package it.pa.repdgt.programmaprogetto.bean;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DettaglioEntiPartnerBean {
	private Long id;
	private String nome;
	private List<String> referenti;
	private String stato;
}
