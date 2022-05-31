package it.pa.repdgt.ente.exception;

import java.io.Serializable;

public class EnteSedeProgettoException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -1711082481928313676L;

	public EnteSedeProgettoException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public EnteSedeProgettoException(String exceptionMessage, Exception ex) {
		super (exceptionMessage, ex);
	}
}