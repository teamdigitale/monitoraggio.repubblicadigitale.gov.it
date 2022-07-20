package it.pa.repdgt.gestioneutente.aspect;

import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import lombok.extern.slf4j.Slf4j;

@Component
@Aspect
@Slf4j
public class LoggingAspect {
	@Around("@annotation(it.pa.repdgt.shared.annotation.LogMethod)")
	public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
		final Object proced = joinPoint.proceed();
		if (!log.isDebugEnabled()) {
			return proced;
		}
		
		final String args = Arrays.toString(joinPoint.getArgs());
		MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
		String methodName = String.format("method: %s.%s", methodSignature.getDeclaringType().getName(), methodSignature.getName());

		StringBuilder logEnterMethod = new StringBuilder( String.format("START - %s()", methodName) );
		if (args != null) {
			logEnterMethod.append(" ")
						  .append( String.format(" with argument[s] = %s", args) );
		}
		log.info(logEnterMethod.toString());
		return proced;
	}

	@Around("@annotation(it.pa.repdgt.shared.annotation.LogExecutionTime)")
	public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
		MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();

		final StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		Object proceed = joinPoint.proceed();
		stopWatch.stop();

		String methodName = String.format("method: %s.%s", methodSignature.getDeclaringType().getName(), methodSignature.getName());
		log.info("TIMING - {} executed in {} ms", methodName, stopWatch.getTotalTimeMillis());
		return proceed;
	}
}