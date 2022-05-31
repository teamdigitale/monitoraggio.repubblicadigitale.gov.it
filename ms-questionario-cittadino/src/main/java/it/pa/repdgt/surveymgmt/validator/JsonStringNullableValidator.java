package it.pa.repdgt.surveymgmt.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import it.pa.repdgt.surveymgmt.annotation.JsonStringNullable;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JsonStringNullableValidator implements ConstraintValidator<JsonStringNullable, String> {
	@Override
	public void initialize(JsonStringNullable constraintAnnotation) { }

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		log.debug("isValid(String value, ConstraintValidatorContext context) value={} - START", value);
		if(value == null) {
			return Boolean.TRUE;
		}
		final JsonStringValidator jsonStringValidator = new JsonStringValidator();
		return jsonStringValidator.isValid(value, context);
	}
}