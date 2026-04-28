package it.pa.repdgt.surveymgmt.exception;

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
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.exception.ErrorResponseBuilder;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice(basePackages = {"it.pa.repdgt"})
@EnableWebMvc
@Slf4j
public class ApplicationExceptionHandler {

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

	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(value = { QuestionarioTemplateException.class, CittadinoException.class,
			ServizioException.class, QuestionarioCompilatoException.class, ValidationException.class })
	public Map<String, String> handleBusinessException(Exception exc, HttpServletResponse response) {
		log.error("Business exception", exc);
		String errorCode;
		if (exc instanceof QuestionarioTemplateException) {
			errorCode = ((QuestionarioTemplateException) exc).getCodiceErroreEnum().toString();
		} else if (exc instanceof CittadinoException) {
			errorCode = ((CittadinoException) exc).getCodiceErroreEnum().toString();
		} else if (exc instanceof ServizioException) {
			errorCode = ((ServizioException) exc).getCodiceErroreEnum().toString();
		} else if (exc instanceof QuestionarioCompilatoException) {
			errorCode = ((QuestionarioCompilatoException) exc).getCodiceErroreEnum().toString();
		} else if (exc instanceof ValidationException) {
			errorCode = ((ValidationException) exc).getCodiceErroreEnum().toString();
		} else {
			errorCode = CodiceErroreEnum.G01.toString();
		}
		return ErrorResponseBuilder.buildBusiness(exc.getMessage(), errorCode, response);
	}

	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(value = Exception.class)
	public Map<String, String> handleException(Exception exc, HttpServletResponse response) {
		log.error("Unhandled exception", exc);
		return ErrorResponseBuilder.buildGeneric(response);
	}
}
