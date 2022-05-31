package it.pa.repdgt.ente.exception;

import java.io.Serializable;

public class EnteSedeProgettoFacilitatoreException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 3311207025753558917L;

	public EnteSedeProgettoFacilitatoreException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public EnteSedeProgettoFacilitatoreException(String exceptionMessage, Exception ex) {
		super (exceptionMessage, ex);
	}
}
