package it.pa.repdgt.integrazione.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RocketChatRegistraUtenteRequest implements Serializable {
	private static final long serialVersionUID = 740411098829821634L;

	private String username;
	private String name;
	private String email;
	private String password;
	private String secretUrl;
}