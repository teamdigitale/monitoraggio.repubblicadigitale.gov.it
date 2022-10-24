package it.pa.repdgt.integrazione.exception;

import java.io.Serializable;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

public class UtenteException extends BaseException implements Serializable {
	private static final long serialVersionUID = 4183828778797680729L;

	public UtenteException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, codiceErroreEnum);
	}
	
	public UtenteException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, ex, codiceErroreEnum);
	}
}
