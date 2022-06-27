package it.pa.repdgt.shared.exception;

import java.io.Serializable;

public class StoricoEnteException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -7590771433923326415L;

	public StoricoEnteException(String errorMessageExc) {
		super(errorMessageExc);
	}
	
	public StoricoEnteException(String errorMessageExc, Exception exc) {
		super(errorMessageExc, exc);
	}
}