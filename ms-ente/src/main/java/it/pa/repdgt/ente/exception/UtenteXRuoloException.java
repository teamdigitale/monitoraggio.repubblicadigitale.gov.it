package it.pa.repdgt.ente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class UtenteXRuoloException extends BaseException {
	public UtenteXRuoloException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
		this.codiceErroreEnum = codiceErroreEnum;
	}
	
	public UtenteXRuoloException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super (exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}