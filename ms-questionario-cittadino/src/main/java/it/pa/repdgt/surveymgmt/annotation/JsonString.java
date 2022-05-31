package it.pa.repdgt.surveymgmt.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import it.pa.repdgt.surveymgmt.validator.JsonStringValidator;

@Constraint(validatedBy = JsonStringValidator.class)
@Target(value = { 
	ElementType.FIELD, 
	ElementType.PARAMETER,
	ElementType.TYPE_PARAMETER,
	ElementType.METHOD,
	ElementType.LOCAL_VARIABLE
})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface JsonString {
	String message() default  "La stringa non è in formato json o contiene sintasi json errata";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}