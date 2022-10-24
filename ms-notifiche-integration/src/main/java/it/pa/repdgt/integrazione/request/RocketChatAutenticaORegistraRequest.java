package it.pa.repdgt.integrazione.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RocketChatAutenticaORegistraRequest implements Serializable {
	private static final long serialVersionUID = 6249115215716354713L;

	private String username;
	private String name;
	private String email;
	private String avatarUrlUtente;
}