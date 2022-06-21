package it.pa.repdgt.surveymgmt.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CittadinoDto {
	private Long id;
	private String nome;
	private String cognome;
	private Long numeroServizi;
	private Long numeroQuestionariCompilati;

}
