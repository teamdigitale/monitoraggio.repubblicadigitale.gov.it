package it.pa.repdgt.shared.restapi.param;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
public class SceltaProfiloParamLight  implements Serializable {

	private static final long serialVersionUID = -5112137216707862594L;

	@NotNull
	private String codiceRuoloUtenteLoggato;
	
	@NotNull
	private String cfUtenteLoggato;
}
