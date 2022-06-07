package it.pa.repdgt.gestioneutente.aspect;

import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import lombok.extern.slf4j.Slf4j;

@Component
@Aspect
@Slf4j
public class LoggingAspect {

//	@Around("execution(public * it.pa.repdgt.gestioneutente.*.*.*(..))")
//	public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
//		final String args = Arrays.toString(joinPoint.getArgs());
//		MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
//		String methodName = String.format("method: %s.%s", methodSignature.getDeclaringType().getName(),
//				methodSignature.getName());
//
//		if (args != null) {
//			log.info("START - {}() with argument[s] = {}", methodName, args);
//		}
//
//		final Object proced = joinPoint.proceed();
//		log.info("END - {}() with result = {}", methodName, proced);
//		return proced;
//	}

//	@Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
//	public void restController() {
//	}
//
//	@Pointcut("execution(public * *.*.*(..))")
//	protected void allMethod() {
//	}

	/**
	 * Pointcut that matches all Spring beans in the application's main packages.
	 */
	@Pointcut("within(it.pa.repdgt.gestioneutente..*)" + 
			  " || within(it.pa.repdgt.gestioneutente.service..*)"
			+ " || within(it.pa.repdgt.gestioneutente.restapi..*)")
	public void myApplicationPackagePointcut() {
		// Method is empty as this is just a Pointcut, the implementations are in the
		// advices.
	}

	/**
	 * Pointcut that matches all repositories, services and Web REST endpoints.
	 */
	@Pointcut("within(@org.springframework.stereotype.Repository *)"
			+ " || within(@org.springframework.stereotype.Service *)"
			+ " || within(@org.springframework.stereotype.Component *)"
			+ " || within(@org.springframework.web.bind.annotation.RestController *)")
	public void springBeanPointcut() {
		// Method is empty as this is just a Pointcut, the implementations are in the
		// advices.
	}

	/**
	 * Advice that logs when a method is entered and exited.
	 *
	 * @param joinPoint join point for advice
	 * @return result
	 * @throws Throwable throws IllegalArgumentException
	 */
	@Around("myApplicationPackagePointcut() && springBeanPointcut()")
	public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
		if (log.isDebugEnabled()) {
			log.info("START: {}.{}() with argument[s] = {}", joinPoint.getSignature().getDeclaringTypeName(),
					joinPoint.getSignature().getName(), Arrays.toString(joinPoint.getArgs()));
		}
		try {
			Object result = joinPoint.proceed();
			if (log.isDebugEnabled()) {
				log.debug("END: {}.{}() with result = {}", joinPoint.getSignature().getDeclaringTypeName(),
						joinPoint.getSignature().getName(), result);
			}
			return result;
		} catch (IllegalArgumentException ex) {
			log.error("Illegal argument: {} in {}.{}()", Arrays.toString(joinPoint.getArgs()),
					joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName());
			throw ex;
		}
	}

//	@Around("allMethod() && allMethod() && args(..,request)")
//	public Object logApi(ProceedingJoinPoint joinPoint, HttpServletRequest request) throws Throwable {
//		log.debug("Entering in Method :  " + joinPoint.getSignature().getName());
//		log.debug("Class Name :  " + joinPoint.getSignature().getDeclaringTypeName());
//		log.debug("Arguments :  " + Arrays.toString(joinPoint.getArgs()));
//		log.debug("Target class : " + joinPoint.getTarget().getClass().getName());
//
//		if (request != null) {
//			log.debug("Start Header Section of request ");
//			log.debug("Method Type : " + request.getMethod());
//			Enumeration<String> headerNames = request.getHeaderNames();
//			while (headerNames.hasMoreElements()) {
//				String headerName = headerNames.nextElement();
//				String headerValue = request.getHeader(headerName);
//				log.debug("Header Name: " + headerName + " Header Value : " + headerValue);
//			}
//			log.debug("Request Path info :" + request.getServletPath());
//			log.debug("End Header Section of request ");
//		}
//		return joinPoint.proceed();
//	}
	
	@Around("@annotation(it.pa.repdgt.shared.annotation.LogMethod)")
	public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
		final Object proced = joinPoint.proceed();
		if (log.isDebugEnabled()) {
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