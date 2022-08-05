package it.pa.repdgt.surveymgmt.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class ServizioException extends BaseException {

	public ServizioException(String messageException, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
	
	public ServizioException(String messageException, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, null);
		this.codiceErroreEnum = codiceErroreEnum;
	}
}
