package it.pa.repdgt.shared.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ZendeskException extends BaseException {
    
    public ZendeskException(String messageException, Exception ex, CodiceErroreEnum codiceErroreEnum) {
        super(messageException, ex);
        this.codiceErroreEnum = codiceErroreEnum;
    }

    public ZendeskException(String messageException, CodiceErroreEnum codiceErroreEnum) {
        super(messageException, codiceErroreEnum);
    }
    
}
