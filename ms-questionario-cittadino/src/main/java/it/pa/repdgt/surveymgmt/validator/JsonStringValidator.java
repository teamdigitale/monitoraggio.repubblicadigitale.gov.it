package it.pa.repdgt.surveymgmt.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;

import it.pa.repdgt.surveymgmt.annotation.JsonString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JsonStringValidator implements ConstraintValidator<JsonString, String> {

	@Override
	public void initialize(JsonString constraintAnnotation) {
		log.debug("initialize(JsonString constraintAnnotation) - START");
		log.debug("initialize(JsonString constraintAnnotation) - END");
	}

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		log.debug("isValid(String value, ConstraintValidatorContext context) value={}- START", value);
		if (value == null) {
			return Boolean.FALSE;
		}
		try {
			JsonParser.parseString(value);
		} catch (JsonParseException ex) {
			log.error("{}", ex);
			return Boolean.FALSE;
		}
		return Boolean.TRUE;
	}
}