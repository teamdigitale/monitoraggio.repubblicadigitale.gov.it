package it.pa.repdgt.programmaprogetto.exception;

import java.io.Serializable;

public class ProgrammaException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4751093921632088853L;

	public ProgrammaException(String exceptionMessage) {
		super(exceptionMessage);
	}
}