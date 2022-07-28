package it.pa.repdgt.shared.exception;

import java.io.Serializable;

public class RuoloUtenteException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -9101341239184638605L;

	public RuoloUtenteException(String errorMessageExc) {
		super(errorMessageExc);
	}
	
	public RuoloUtenteException(String errorMessageExc, Exception exc) {
		super(errorMessageExc, exc);
	}
}