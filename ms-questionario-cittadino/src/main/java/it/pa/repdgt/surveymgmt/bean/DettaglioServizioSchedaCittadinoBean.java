package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DettaglioServizioSchedaCittadinoBean implements Serializable {
	private static final long serialVersionUID = 7237761000675359461L;

	private Long idServizio;
	private String nomeServizio;
	private String nomeCompletoFacilitatore;
	private String idQuestionarioCompilato;
	private String statoQuestionario;
}