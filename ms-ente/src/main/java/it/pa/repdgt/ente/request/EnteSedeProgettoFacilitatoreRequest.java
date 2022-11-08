package it.pa.repdgt.ente.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnteSedeProgettoFacilitatoreRequest extends SceltaProfiloParam{
	
	@NotBlank
	private String codiceFiscaleFacVol;

	@NotNull
	private Long idProgettoFacVol;
	
	private String tipoContratto;
	
	@NotNull
	private Long idSedeFacVol;
	
	@NotNull
	private Long idEnteFacVol;
}