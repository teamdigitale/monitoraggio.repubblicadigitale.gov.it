package it.pa.repdgt.surveymgmt.exception;

import java.io.Serializable;

public class QuestionarioCompilatoException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = 1L;

	public QuestionarioCompilatoException(String messageException, Exception ex) {
		super(messageException, ex);
	}
	
	public QuestionarioCompilatoException(String messageException) {
		this(messageException, null);
	}
}