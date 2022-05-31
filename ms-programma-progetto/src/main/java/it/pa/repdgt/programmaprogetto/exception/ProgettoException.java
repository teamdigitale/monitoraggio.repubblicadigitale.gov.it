package it.pa.repdgt.programmaprogetto.exception;

import java.io.Serializable;

public class ProgettoException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4751093921632088853L;
	
	public ProgettoException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public ProgettoException(String exceptionMessage, Exception ex) {
		super(exceptionMessage, ex);
	}
}