package it.pa.repdgt.surveymgmt.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CittadinoDto {
	private Long id;
	private String codiceFiscale;
	private Date dataUltimoAggiornamento;
	private Long numeroServizi;
	private Long numeroQuestionariCompilati;

}
