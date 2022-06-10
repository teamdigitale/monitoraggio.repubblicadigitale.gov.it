package it.pa.repdgt.shared.exception;

import java.io.Serializable;

public class InvioEmailException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -7590771433923326415L;

	public InvioEmailException(String errorMessageExc) {
		super(errorMessageExc);
	}
	
	public InvioEmailException(String errorMessageExc, Exception exc) {
		super(errorMessageExc, exc);
	}
}