package it.pa.repdgt.integrazione.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RocketChatCreaTokenRequest implements Serializable {
	private String userId;
}