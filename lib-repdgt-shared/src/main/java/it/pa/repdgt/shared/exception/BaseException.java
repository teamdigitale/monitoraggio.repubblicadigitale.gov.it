package it.pa.repdgt.shared.exception;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class BaseException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 2372321570252042960L;

	protected CodiceErroreEnum codiceErroreEnum;
	
	public BaseException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
		this.codiceErroreEnum = codiceErroreEnum;
	}
	
	public BaseException(String exceptionMessage, Exception ex) {
		super (exceptionMessage, ex);
	}
}