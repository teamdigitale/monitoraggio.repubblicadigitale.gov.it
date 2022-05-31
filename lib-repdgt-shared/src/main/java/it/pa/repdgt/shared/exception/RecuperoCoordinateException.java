package it.pa.repdgt.shared.exception;

import java.io.Serializable;

public class RecuperoCoordinateException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -7590771433923326415L;

	public RecuperoCoordinateException(String errorMessageExc) {
		super(errorMessageExc);
	}
	
	public RecuperoCoordinateException(String errorMessageExc, Exception exc) {
		super(errorMessageExc, exc);
	}
}