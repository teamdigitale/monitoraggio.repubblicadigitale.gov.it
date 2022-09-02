package it.pa.repdgt.programmaprogetto.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class ProgrammaException extends BaseException {
	private static final long serialVersionUID = 4751093921632088853L;

	public ProgrammaException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}