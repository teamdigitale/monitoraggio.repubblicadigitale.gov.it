package it.pa.repdgt.surveymgmt.param;

import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FiltroListaQuestionariTemplateParam {
	private String criterioRicerca;
	private StatoQuestionarioEnum statoQuestionario;
}