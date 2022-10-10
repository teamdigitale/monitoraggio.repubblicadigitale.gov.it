package it.pa.repdgt.integrazione.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RocketChatImpostaAvatarUtenteRequest implements Serializable {
	private static final long serialVersionUID = 1510882882321576610L;

	private String avatarUrl;
	private String userId;
}