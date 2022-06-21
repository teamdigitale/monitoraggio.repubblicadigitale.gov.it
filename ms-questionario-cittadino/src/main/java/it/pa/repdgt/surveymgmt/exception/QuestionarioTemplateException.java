package it.pa.repdgt.surveymgmt.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionarioTemplateException extends RuntimeException {
	private static final long serialVersionUID = -5106720840826699191L;
	
	public QuestionarioTemplateException(String messageException, Exception ex) {
		super(messageException, ex);
	}
	
	public QuestionarioTemplateException(String messageException) {
		this(messageException, null);
	}
}