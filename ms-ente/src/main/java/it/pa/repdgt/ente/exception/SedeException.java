package it.pa.repdgt.ente.exception;

import java.io.Serializable;

public class SedeException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -2408925357949957553L;

	public SedeException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public SedeException(String exceptionMessage, Exception ex) {
		super (exceptionMessage, ex);
	}
}