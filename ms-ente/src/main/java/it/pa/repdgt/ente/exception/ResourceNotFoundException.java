package it.pa.repdgt.ente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class ResourceNotFoundException extends BaseException {
	public ResourceNotFoundException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}