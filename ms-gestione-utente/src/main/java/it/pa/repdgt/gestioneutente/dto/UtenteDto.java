package it.pa.repdgt.gestioneutente.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtenteDto {
	private Long id;
	private String nome;
	private String codiceFiscale;
	private String ruoli;
	private String stato;
}