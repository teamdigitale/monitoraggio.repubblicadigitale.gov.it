package it.pa.repdgt.surveymgmt.request;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetCittadiniRequest {
	@NotBlank(message = "criterioRicerca deve essere valorizzato")
	private String criterioRicerca;
}
