package it.pa.repdgt.gestioneutente.exception;

import java.io.Serializable;

public class RuoloException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -4247694297130242207L;

	public RuoloException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public RuoloException(String exceptionMessage, Exception ex) {
		super(exceptionMessage, ex);
	}
}