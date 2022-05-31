package it.pa.repdgt.ente.exception;

import java.io.Serializable;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 4751093921632088853L;

	public ResourceNotFoundException(String exceptionMessage) {
		super(exceptionMessage);
	}
}