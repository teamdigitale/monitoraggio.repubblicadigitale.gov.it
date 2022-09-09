package it.pa.repdgt.gestioneutente.exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class ApplicationExceptionHandler {

	// Gestione errore per annotation @Valid
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public Map<String, String> handleInvalidArgument(MethodArgumentNotValidException exc) {
		log.error("{}", exc);
		Map<String, String> erroriValidazione = new HashMap<>();
		BindingResult bindingRsult = exc.getBindingResult();
		List<FieldError> listFieldError = bindingRsult.getFieldErrors();
		listFieldError.forEach(fieldError -> {
			erroriValidazione.put(fieldError.getField(), fieldError.getDefaultMessage());
		});
		return erroriValidazione;
	}

	// Gestione errore per annotation @Validated
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = ConstraintViolationException.class)
	public List<String> constraintViolationException(ConstraintViolationException exc)
			throws IOException {
		log.error("{}", exc);
		List<String> erroriValidazione = exc.getConstraintViolations()
											.stream()
											.map(ConstraintViolation::getMessage)
											.collect(Collectors.toList());
		return erroriValidazione;
	}

	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	@ExceptionHandler(value = ResourceNotFoundException.class)
	public Map<String, String> handleResourceNotFound(ResourceNotFoundException exc) {
		log.error("{}", exc);
		Map<String, String> errori = new HashMap<>();
		errori.put("message", exc.getMessage());
		return errori;
	}
	
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(value = {  UtenteException.class, RuoloException.class, UtenteXRuoloException.class, Exception.class })
	public Map<String, String> handleException(Exception exc) {
		log.error("{}", exc);
		final Map<String, String> errori = new HashMap<>();
		errori.put("message", exc.getMessage());
		UtenteException utenteException;
		RuoloException ruoloException;
		UtenteXRuoloException utenteXRuoloException;
		if(exc instanceof UtenteException) {
			utenteException = (UtenteException) exc;
			errori.put("errorCode", utenteException.getCodiceErroreEnum().toString());
		} else if(exc instanceof RuoloException) {
			ruoloException = (RuoloException) exc;
			errori.put("errorCode", ruoloException.getCodiceErroreEnum().toString());
		} else if(exc instanceof UtenteXRuoloException) {
			utenteXRuoloException = (UtenteXRuoloException) exc;
			errori.put("errorCode", utenteXRuoloException.getCodiceErroreEnum().toString());
		} else {
			errori.put("errorCode", CodiceErroreEnum.G01.toString());
		}
		
		return errori;
	}
}