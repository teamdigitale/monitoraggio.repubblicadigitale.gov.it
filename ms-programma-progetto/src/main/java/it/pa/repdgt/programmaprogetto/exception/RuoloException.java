package it.pa.repdgt.programmaprogetto.exception;

import java.io.Serializable;

public class RuoloException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4751093921632088853L;

	public RuoloException(String exceptionMessage) {
		super(exceptionMessage);
	}
}