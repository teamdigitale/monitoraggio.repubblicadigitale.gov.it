package it.pa.repdgt.programmaprogetto.exception;

import java.io.Serializable;

public class EnteException extends RuntimeException implements Serializable{
	private static final long serialVersionUID = 4350178983836021040L;

	public EnteException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public EnteException(String exceptionMessage, Exception ex) {
		super (exceptionMessage, ex);
	}
}