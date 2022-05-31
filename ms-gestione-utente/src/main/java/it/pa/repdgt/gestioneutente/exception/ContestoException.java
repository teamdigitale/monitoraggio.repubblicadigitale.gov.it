package it.pa.repdgt.gestioneutente.exception;

import java.io.Serializable;

public class ContestoException extends RuntimeException implements Serializable{
	private static final long serialVersionUID = 1745706542721964266L;

	public ContestoException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public ContestoException(String exceptionMessage, Exception ex) {
		super(exceptionMessage, ex);
	}
}
