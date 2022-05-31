package it.pa.repdgt.gestioneutente.exception;

import java.io.Serializable;

public class RuoloXGruppoException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -7664135172659807547L;

	public RuoloXGruppoException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public RuoloXGruppoException(String exceptionMessage, Exception ex) {
		super(exceptionMessage, ex);
	}
}
