package it.pa.repdgt.surveymgmt.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Getter
@Setter
public class CittadinoDto {
	private Long id;
	private String codiceFiscale;
	@Temporal(TemporalType.DATE)
	private Date dataUltimoAggiornamento;
	private Long numeroServizi;
	private Long numeroQuestionariCompilati;

}
