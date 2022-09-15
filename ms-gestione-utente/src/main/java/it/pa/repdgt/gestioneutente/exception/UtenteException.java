package it.pa.repdgt.gestioneutente.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class UtenteException  extends BaseException	{
	private static final long serialVersionUID = 4183828778797680729L;

	public UtenteException(String exceptionMessage, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, codiceErroreEnum);
	}
	
	public UtenteException(String exceptionMessage, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(exceptionMessage, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}
