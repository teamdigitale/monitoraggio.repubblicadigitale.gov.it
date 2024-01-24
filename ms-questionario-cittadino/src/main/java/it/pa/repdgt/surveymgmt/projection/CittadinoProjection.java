package it.pa.repdgt.surveymgmt.projection;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

public interface CittadinoProjection {
	public Long getId();

	@Temporal(TemporalType.DATE)
	public Date getDataUltimoAggiornamento();

	public String getCodiceFiscale();

	public Long getNumeroServizi();

	public Long getNumeroQuestionariCompilati();
}
