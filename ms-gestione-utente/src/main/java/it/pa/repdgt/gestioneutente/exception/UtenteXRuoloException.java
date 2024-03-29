package it.pa.repdgt.gestioneutente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class UtenteXRuoloException extends BaseException {
	private static final long serialVersionUID = -2408925357949957553L;

	public UtenteXRuoloException(String exceptionMessage,CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, codiceErroreEnum);
	}
	
	public UtenteXRuoloException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}