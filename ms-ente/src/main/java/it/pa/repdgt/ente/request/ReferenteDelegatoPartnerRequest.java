package it.pa.repdgt.ente.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReferenteDelegatoPartnerRequest extends SceltaProfiloParam{
	
	@NotBlank
	private String cfReferenteDelegato;

	@NotNull
	private Long idProgettoDelPartner;
	
	//Referente o Delegato (REGP o DEGP)
	@NotNull
	private String codiceRuoloRefDeg;	
	
	@NotNull
	private Long idEntePartner;
	
	private String mansione;
	
}
