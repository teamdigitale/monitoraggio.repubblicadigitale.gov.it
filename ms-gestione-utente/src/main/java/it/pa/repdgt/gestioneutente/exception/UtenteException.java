package it.pa.repdgt.gestioneutente.exception;

import java.io.Serializable;

public class UtenteException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4183828778797680729L;

	public UtenteException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public UtenteException(String exceptionMessage, Exception ex) {
		super(exceptionMessage, ex);
	}
}
