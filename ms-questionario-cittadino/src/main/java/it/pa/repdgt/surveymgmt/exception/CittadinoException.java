package it.pa.repdgt.surveymgmt.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CittadinoException extends RuntimeException {
	private static final long serialVersionUID = -3953238341091104333L;

	public CittadinoException(String messageException, Exception ex) {
		super(messageException, ex);
	}
	
	public CittadinoException(String messageException) {
		this(messageException, null);
	}
}
