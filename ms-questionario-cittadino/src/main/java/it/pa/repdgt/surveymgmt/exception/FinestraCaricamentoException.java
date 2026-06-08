package it.pa.repdgt.surveymgmt.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class FinestraCaricamentoException extends BaseException {

	public FinestraCaricamentoException(String messageException, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}

	public FinestraCaricamentoException(String messageException, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, codiceErroreEnum);
	}

	public FinestraCaricamentoException(CodiceErroreEnum codiceErroreEnum) {
		super(codiceErroreEnum);
	}
}
