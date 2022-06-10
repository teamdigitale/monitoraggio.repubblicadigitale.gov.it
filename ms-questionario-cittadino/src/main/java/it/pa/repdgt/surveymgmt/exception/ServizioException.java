package it.pa.repdgt.surveymgmt.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServizioException extends RuntimeException {
	private static final long serialVersionUID = 6853289640892562268L;

	public ServizioException(String messageException, Exception ex) {
		super(messageException, ex);
	}
	
	public ServizioException(String messageException) {
		this(messageException, null);
	}
}
