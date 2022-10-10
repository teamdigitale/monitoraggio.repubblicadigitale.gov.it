package it.pa.repdgt.integrazione.exception;

import java.io.Serializable;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;

public class UtenteException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4183828778797680729L;

	public UtenteException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public UtenteException(String exceptionMessage, Exception ex) {
		super(exceptionMessage, ex);
	}
}
