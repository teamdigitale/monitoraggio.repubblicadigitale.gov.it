package it.pa.repdgt.surveymgmt.param;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CittadiniPaginatiParam extends SceltaProfiloParam{
	private static final long serialVersionUID = -239369185483756169L;

	private FiltroListaCittadiniParam filtro;
}
