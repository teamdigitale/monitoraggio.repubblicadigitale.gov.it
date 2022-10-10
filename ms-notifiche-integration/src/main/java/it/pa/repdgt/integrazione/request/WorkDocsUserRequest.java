package it.pa.repdgt.integrazione.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WorkDocsUserRequest {
	private Long idUtente;
	private String username;
	private String email;
	private String password;
}