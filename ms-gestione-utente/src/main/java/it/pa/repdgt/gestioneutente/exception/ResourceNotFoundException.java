package it.pa.repdgt.gestioneutente.exception;

import java.io.Serializable;

public class ResourceNotFoundException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4751093921632088853L;
	
	public ResourceNotFoundException(String exceptionMessage) {
		super(exceptionMessage);
	}
}