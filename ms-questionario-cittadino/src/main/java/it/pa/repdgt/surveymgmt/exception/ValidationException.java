package it.pa.repdgt.surveymgmt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import it.pa.repdgt.shared.exception.BaseException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
public class ValidationException extends BaseException {

    public ValidationException(String messageException, Exception ex, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, ex);
		this.codiceErroreEnum = codiceErroreEnum;
	}
	
	public ValidationException(String messageException, CodiceErroreEnum codiceErroreEnum) {
		super(messageException, codiceErroreEnum);
	}
    
}
