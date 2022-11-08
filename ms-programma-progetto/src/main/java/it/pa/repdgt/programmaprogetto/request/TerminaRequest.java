package it.pa.repdgt.programmaprogetto.request;

import javax.validation.constraints.NotBlank;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TerminaRequest extends SceltaProfiloParam{
	@NotBlank
	private String dataTerminazione;
}