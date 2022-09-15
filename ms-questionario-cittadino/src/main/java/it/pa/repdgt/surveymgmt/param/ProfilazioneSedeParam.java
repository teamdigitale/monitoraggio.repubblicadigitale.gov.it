package it.pa.repdgt.surveymgmt.param;

import javax.validation.constraints.NotNull;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProfilazioneSedeParam extends SceltaProfiloParam {
	private static final long serialVersionUID = 6054724151403987246L;
	
	@NotNull
	private Long idEnte;
}