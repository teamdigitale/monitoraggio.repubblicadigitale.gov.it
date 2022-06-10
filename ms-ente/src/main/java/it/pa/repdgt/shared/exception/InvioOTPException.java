package it.pa.repdgt.shared.exception;

import java.io.Serializable;

public class InvioOTPException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -7590771433923326415L;

	public InvioOTPException(String errorMessageExc) {
		super(errorMessageExc);
	}
	
	public InvioOTPException(String errorMessageExc, Exception exc) {
		super(errorMessageExc, exc);
	}
}