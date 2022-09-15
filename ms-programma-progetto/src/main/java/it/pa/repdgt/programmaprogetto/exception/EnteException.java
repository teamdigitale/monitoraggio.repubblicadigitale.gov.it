package it.pa.repdgt.programmaprogetto.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class EnteException extends BaseException {

	public EnteException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, codiceErroreEnum);
	}
	
	public EnteException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super (exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}