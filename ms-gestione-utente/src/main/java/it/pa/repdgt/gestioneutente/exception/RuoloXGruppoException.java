package it.pa.repdgt.gestioneutente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class RuoloXGruppoException extends BaseException {
	public RuoloXGruppoException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, codiceErroreEnum);
	}
	
	public RuoloXGruppoException(String exceptionMessage, Exception ex) {
		super(exceptionMessage, ex);
	}
	
	public RuoloXGruppoException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}