package it.pa.repdgt.ente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class EnteSedeProgettoFacilitatoreException extends BaseException {
	public EnteSedeProgettoFacilitatoreException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, codiceErroreEnum);
	}
	
	public EnteSedeProgettoFacilitatoreException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super (exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}
