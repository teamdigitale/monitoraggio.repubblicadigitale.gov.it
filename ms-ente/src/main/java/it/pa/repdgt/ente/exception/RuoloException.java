package it.pa.repdgt.ente.exception;

import java.io.Serializable;

public class RuoloException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -2408925357949957553L;

	public RuoloException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public RuoloException(String exceptionMessage, Exception ex) {
		super (exceptionMessage, ex);
	}
}