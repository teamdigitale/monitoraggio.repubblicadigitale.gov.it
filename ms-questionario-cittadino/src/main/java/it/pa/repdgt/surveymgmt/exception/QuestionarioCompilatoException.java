package it.pa.repdgt.surveymgmt.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;

@Getter
public class QuestionarioCompilatoException extends BaseException {
	public QuestionarioCompilatoException(String messageException, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
	
	public QuestionarioCompilatoException(String messageException, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, codiceErroreEnum);
	}
}