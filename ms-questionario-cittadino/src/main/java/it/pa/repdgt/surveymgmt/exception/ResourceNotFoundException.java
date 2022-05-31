package it.pa.repdgt.surveymgmt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
	private static final long serialVersionUID = -5106720840826699191L;
	
	private String messageException;

	public ResourceNotFoundException(String messageException, Exception ex) {
		super(messageException, ex);
	}
	
	public ResourceNotFoundException(String messageException) {
		this(messageException, null);
	}
}