package it.pa.repdgt.ente.exception;

import java.io.Serializable;

public class UtenteXRuoloException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -2408925357949957553L;

	public UtenteXRuoloException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public UtenteXRuoloException(String exceptionMessage, Exception ex) {
		super (exceptionMessage, ex);
	}
}