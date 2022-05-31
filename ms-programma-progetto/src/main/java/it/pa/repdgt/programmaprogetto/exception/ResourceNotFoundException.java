package it.pa.repdgt.programmaprogetto.exception;

import java.io.Serializable;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4751093921632088853L;
	
	private Object[] args;

	public ResourceNotFoundException(String exceptionMessage) {
		super(exceptionMessage);
	}
	
	public ResourceNotFoundException(String exceptionMessage, Object[] args) {
		super(exceptionMessage);
		this.args = args;
	}
}