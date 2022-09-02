package it.pa.repdgt.programmaprogetto.request;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TerminaRequest {
	@NotBlank
	private String dataTerminazione;
}