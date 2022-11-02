package it.pa.repdgt.ente.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReferenteDelegatoGestoreProgrammaRequest extends SceltaProfiloParam{
	
	@NotBlank
	private String cfReferenteDelegato;

	@NotNull
	private Long idProgrammaGestore;
	
	//Referente o Delegato (REG o DEG)
	@NotNull
	private String codiceRuoloRefDeg;
	
	@NotNull
	private Long idEnteGestore;
	
	private String mansione;
}