package it.pa.repdgt.ente.bean;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DettaglioProfiliBean {
	private Long id;
	private String tipoEntita;
	private String nome;
	private String profilo;
	private List<String> referenti;
	private String stato;
}
