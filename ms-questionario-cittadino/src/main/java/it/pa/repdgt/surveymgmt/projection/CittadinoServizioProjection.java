package it.pa.repdgt.surveymgmt.projection;

import java.util.Date;

public interface CittadinoServizioProjection {
	public Long getIdCittadino();

	public String getIdQuestionario();

	public String getStatoQuestionario();

	public Date getDataUltimoAggiornamento();
}
