package it.pa.repdgt.integrazione.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

public class DrupalException extends BaseException {
	private static final long serialVersionUID = 3888445324383742669L;

	public DrupalException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, codiceErroreEnum);
	}
	
	public DrupalException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}
