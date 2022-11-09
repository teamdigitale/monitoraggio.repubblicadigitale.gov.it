package it.pa.repdgt.surveymgmt.exception;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice(basePackages = {"it.pa.repdgt"})
@EnableWebMvc
@Slf4j
public class ApplicationExceptionHandler {

	// Gestione errore per annotation @Valid
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public Map<String, String> handleInvalidArgument(MethodArgumentNotValidException exc, HttpServletResponse response) {
		log.error("{}", exc);
		Map<String, String> erroriValidazione = exc.getBindingResult()
				.getFieldErrors()
				.stream()
				.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		erroriValidazione.put("errorCode", CodiceErroreEnum.G02.toString());
		List<String> headers = new ArrayList<>();
		headers.addAll(response.getHeaders("exchange-id"));
		String exchangeId = headers.get(0);
		erroriValidazione.put("exchange-id", exchangeId);
		
		return erroriValidazione;
	}

	// Gestione errore per annotation @Validated
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = ConstraintViolationException.class)
	public Map<String, String> constraintViolationException(ConstraintViolationException exc, HttpServletResponse response) throws IOException {
		log.error("{}", exc);
		Map<String, String> errori = new HashMap<>();
		errori.put("errorMessage", exc.getConstraintViolations()
									.stream()
									.map(constraintViolation -> String.format("%s - %s",constraintViolation.getPropertyPath(), constraintViolation.getMessage()))
									.collect(Collectors.toList()).toString());
		List<String> headers = new ArrayList<>();
		headers.addAll(response.getHeaders("exchange-id"));
		String exchangeId = headers.get(0);
		errori.put("exchange-id", exchangeId);
		return errori;
	}

	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = HttpMessageNotReadableException.class)
	public Map<String, String> handleHttpMessageNotReadableException(HttpMessageNotReadableException exc, HttpServletResponse response) {
		log.error("{}", exc);
		Map<String, String> errori = new HashMap<>();
		errori.put("message", "Manca il corpo della richiesta oppure il json della richiesta non è valido");
		errori.put("errorCode", CodiceErroreEnum.G02.toString());
		List<String> headers = new ArrayList<>();
		headers.addAll(response.getHeaders("exchange-id"));
		String exchangeId = headers.get(0);
		errori.put("exchange-id", exchangeId);
		return errori;
	}
	
	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	@ExceptionHandler(value = ResourceNotFoundException.class)
	public Map<String, String> handleResourceNotFound(ResourceNotFoundException exc, HttpServletResponse response) {
		log.error("{}", exc);
		final Map<String, String> errori = new HashMap<>();
		errori.put("message", exc.getMessage());
		errori.put("errorCode", exc.getCodiceErroreEnum().toString());
		List<String> headers = new ArrayList<>();
		headers.addAll(response.getHeaders("exchange-id"));
		String exchangeId = headers.get(0);
		errori.put("exchange-id", exchangeId);
		
		return errori;
	}
	
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(value = {  QuestionarioTemplateException.class, CittadinoException.class, ServizioException.class, 
								 QuestionarioCompilatoException.class, Exception.class })
	public Map<String, String> handleException(Exception exc, HttpServletResponse response) {
		log.error("{}", exc);
		final Map<String, String> errori = new HashMap<>();
		errori.put("message", exc.getMessage());
		QuestionarioTemplateException questionarioTemplateException;
		CittadinoException cittadinoException;
		ServizioException servizioException;
		QuestionarioCompilatoException questionarioCompilatoException;
		if(exc instanceof QuestionarioTemplateException) {
			questionarioTemplateException = (QuestionarioTemplateException) exc;
			errori.put("errorCode", questionarioTemplateException.getCodiceErroreEnum().toString());
		} else if(exc instanceof CittadinoException) {
			cittadinoException = (CittadinoException) exc;
			errori.put("errorCode", cittadinoException.getCodiceErroreEnum().toString());
		} else if(exc instanceof ServizioException) {
			servizioException = (ServizioException) exc;
			errori.put("errorCode", servizioException.getCodiceErroreEnum().toString());
		} else if(exc instanceof QuestionarioCompilatoException) {
			questionarioCompilatoException = (QuestionarioCompilatoException) exc;
			errori.put("errorCode", questionarioCompilatoException.getCodiceErroreEnum().toString());
		} else {
			errori.put("errorCode", CodiceErroreEnum.G01.toString());
		}
		List<String> headers = new ArrayList<>();
		headers.addAll(response.getHeaders("exchange-id"));
		String exchangeId = headers.get(0);
		errori.put("exchange-id", exchangeId);
		
		return errori;
	}
}