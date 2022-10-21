package it.pa.repdgt.integrazione.request;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WorkDocsUserRequest extends SceltaProfiloParam {
	private Long idUtente;
	private String username;
	private String email;
	private String password;
}