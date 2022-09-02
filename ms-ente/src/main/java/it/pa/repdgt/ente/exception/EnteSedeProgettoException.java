package it.pa.repdgt.ente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

public class EnteSedeProgettoException extends BaseException {
	public EnteSedeProgettoException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
		this.codiceErroreEnum = codiceErroreEnum;
	}
	
	public EnteSedeProgettoException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super (exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}