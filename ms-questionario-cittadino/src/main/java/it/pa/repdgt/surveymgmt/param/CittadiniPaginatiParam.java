package it.pa.repdgt.surveymgmt.param;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CittadiniPaginatiParam extends ProfilazioneParam{
	private static final long serialVersionUID = -239369185483756169L;

	private FiltroListaCittadiniParam filtro;
}
