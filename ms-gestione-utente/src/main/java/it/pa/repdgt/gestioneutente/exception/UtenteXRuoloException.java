package it.pa.repdgt.gestioneutente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

public class UtenteXRuoloException extends BaseException {
	private static final long serialVersionUID = -2408925357949957553L;

	public UtenteXRuoloException(String exceptionMessage,CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
	}
	
	public UtenteXRuoloException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super (exceptionMessage, ex);
	}
}