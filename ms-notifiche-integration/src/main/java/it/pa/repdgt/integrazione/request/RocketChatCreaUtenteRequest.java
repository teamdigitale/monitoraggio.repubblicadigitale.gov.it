package it.pa.repdgt.integrazione.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RocketChatCreaUtenteRequest {
	private String username;
	private String name;
	private String email;
	private String password;
}