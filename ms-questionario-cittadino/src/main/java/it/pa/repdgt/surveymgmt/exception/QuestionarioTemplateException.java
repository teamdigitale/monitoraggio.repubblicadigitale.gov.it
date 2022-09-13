package it.pa.repdgt.surveymgmt.exception;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionarioTemplateException extends BaseException {
	
	public QuestionarioTemplateException(String messageException, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
	
	public QuestionarioTemplateException(String messageException, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, codiceErroreEnum);
	}
}