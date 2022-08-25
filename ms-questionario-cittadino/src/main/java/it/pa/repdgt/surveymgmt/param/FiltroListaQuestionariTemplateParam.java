package it.pa.repdgt.surveymgmt.param;

import javax.validation.constraints.Min;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FiltroListaQuestionariTemplateParam {
	private String criterioRicerca;
	private String statoQuestionario;
	
	@Min(value = 0, message = "currPage deve essere maggiore di 0")
	private Integer currPage;
	@Min(value = 0, message = "pageSize deve essere maggiore di 0")
	private Integer pageSize;
}