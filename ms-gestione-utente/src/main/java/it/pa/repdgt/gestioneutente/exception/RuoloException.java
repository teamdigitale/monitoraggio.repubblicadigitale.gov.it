package it.pa.repdgt.gestioneutente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

public class RuoloException extends BaseException {
	private static final long serialVersionUID = -4247694297130242207L;

	public RuoloException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
	}
	
	public RuoloException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, ex);
	}
}