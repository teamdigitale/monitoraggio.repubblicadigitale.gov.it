package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.annotation.JsonString;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class QuestionarioCompilatoRequest extends SceltaProfiloParam implements Serializable {
	private static final long serialVersionUID = 1L;

	// Dati consenso cittadino e (codice fiscale e/o numero documento del cittadino
	// che compila il questionario)
	@NotNull
	private ConsensoTrattamentoDatiRequest ConsensoTrattamentoDatiRequest;

	// Sezioni del questionario compilato (Q1, Q2, Q3, Q4)
	@NotNull
	@JsonString
	private String sezioneQ1Questionario;
	@NotNull
	@JsonString
	private String sezioneQ2Questionario;
	@NotNull
	@JsonString
	private String sezioneQ3Questionario;
	@NotNull
	@JsonString
	private String sezioneQ4Questionario;

	// Dati del cittadino da aggiornare
	private String codiceFiscaleDaAggiornare;
	private String tipoDocumentoDaAggiornare;
	private String numeroDocumentoDaAggiornare;
	private String genereDaAggiornare;
	private Long fasciaDiEtaIdDaAggiornare;
	private String titoloDiStudioDaAggiornare;
	private String occupazioneDaAggiornare;
	private String cittadinanzaDaAggiornare;
}