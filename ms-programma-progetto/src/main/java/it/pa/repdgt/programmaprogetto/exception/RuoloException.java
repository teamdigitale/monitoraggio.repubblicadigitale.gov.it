package it.pa.repdgt.programmaprogetto.exception;


import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class RuoloException extends BaseException {
	public RuoloException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}