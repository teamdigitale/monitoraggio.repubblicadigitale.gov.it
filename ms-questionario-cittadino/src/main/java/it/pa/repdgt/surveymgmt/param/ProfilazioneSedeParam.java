package it.pa.repdgt.surveymgmt.param;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProfilazioneSedeParam extends ProfilazioneParam {
	@NotNull
	private Long idEnte;
}