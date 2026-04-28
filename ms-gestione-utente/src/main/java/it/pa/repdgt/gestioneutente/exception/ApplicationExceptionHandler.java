package it.pa.repdgt.gestioneutente.exception;

import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.exception.ErrorResponseBuilder;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class ApplicationExceptionHandler {

	// Validation @Valid
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public Map<String, String> handleInvalidArgument(MethodArgumentNotValidException exc, HttpServletResponse response) {
		log.error("Validation error", exc);
		String message = exc.getBindingResult().getFieldErrors().stream()
				.map(FieldError::getField).collect(Collectors.joining(", "));
		return ErrorResponseBuilder.buildBusiness(
				"Validazione fallita sui campi: " + message,
				CodiceErroreEnum.G02.toString(), response);
	}

	// Validation @Validated
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = ConstraintViolationException.class)
	public Map<String, String> constraintViolationException(ConstraintViolationException exc, HttpServletResponse response) {
		log.error("Constraint violation", exc);
		return ErrorResponseBuilder.buildBusiness(
				"Validazione fallita sui parametri della richiesta",
				CodiceErroreEnum.G02.toString(), response);
	}

	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = HttpMessageNotReadableException.class)
	public Map<String, String> handleHttpMessageNotReadableException(HttpMessageNotReadableException exc, HttpServletResponse response) {
		log.error("Malformed request body", exc);
		return ErrorResponseBuilder.buildBusiness(
				"Richiesta non valida: corpo mancante o non leggibile",
				CodiceErroreEnum.G02.toString(), response);
	}

	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	@ExceptionHandler(value = ResourceNotFoundException.class)
	public Map<String, String> handleResourceNotFound(ResourceNotFoundException exc, HttpServletResponse response) {
		log.error("Resource not found", exc);
		return ErrorResponseBuilder.buildBusiness(
				exc.getMessage(),
				exc.getCodiceErroreEnum().toString(), response);
	}

	// Eccezioni business custom: il messaggio e' controllato dagli sviluppatori
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(value = { UtenteException.class, RuoloException.class, UtenteXRuoloException.class })
	public Map<String, String> handleBusinessException(Exception exc, HttpServletResponse response) {
		log.error("Business exception", exc);
		String errorCode;
		if (exc instanceof UtenteException) {
			errorCode = ((UtenteException) exc).getCodiceErroreEnum().toString();
		} else if (exc instanceof RuoloException) {
			errorCode = ((RuoloException) exc).getCodiceErroreEnum().toString();
		} else if (exc instanceof UtenteXRuoloException) {
			errorCode = ((UtenteXRuoloException) exc).getCodiceErroreEnum().toString();
		} else {
			errorCode = CodiceErroreEnum.G01.toString();
		}
		return ErrorResponseBuilder.buildBusiness(exc.getMessage(), errorCode, response);
	}

	// Catch-all per eccezioni non previste: messaggio generico, mai dettagli interni
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(value = Exception.class)
	public Map<String, String> handleException(Exception exc, HttpServletResponse response) {
		log.error("Unhandled exception", exc);
		return ErrorResponseBuilder.buildGeneric(response);
	}
}
