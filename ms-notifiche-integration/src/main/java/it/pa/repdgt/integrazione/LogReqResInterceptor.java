package it.pa.repdgt.integrazione;


import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jboss.logging.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class LogReqResInterceptor implements HandlerInterceptor {
	private static final String REQUEST   = "[REQUEST]";
	private static final String RESPONSE  = "[RESPONSE]";
	private static final String LOG_IN  = "===>  ";
	private static final String LOG_OUT = "<===  ";
	private static final String HEADERS = "[HEADERS]";
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
		String uuid = (this.getRequestHeaders(request).get("authtoken"));
		String exId = uuid != null && !uuid.equals("") ? 
				uuid.substring(uuid.length() - 15).concat("-").concat(uuid.substring(0, 15)) : 
					UUID.randomUUID().toString();;
		
		response.setHeader("exchange-id", exId);
		
		MDC.put("exchange-id", exId);
		
		final String requestMethodAndPathUri = String.format("%s %s", request.getMethod(), request.getRequestURL()); 
		final String requestHeaders = String.format("%s", this.getRequestHeaders(request));
		final String exchangeId = String.format("exchange-id:  %s", exId);
		
		StringBuilder logRequestBuilder =  new StringBuilder("\n\n")
												.append(LOG_IN).append(REQUEST).append("\n")
											 	.append(LOG_IN).append(requestMethodAndPathUri).append("\n")
											 	.append(LOG_IN).append(exchangeId).append("\n")
											 	.append(LOG_IN).append(HEADERS).append("\n")
												.append(requestHeaders).append("\n");
		
		log.info("{}", logRequestBuilder.toString());
		
		return true;
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
		final String requestMethodAndPathUri = String.format("%s %s", request.getMethod(), request.getRequestURL()); 

		final String status = String.format("stato: %s", response.getStatus()); 
		final String headers = String.format("%s", this.getResponseHeaders(response));
		
		String logRequest =  new StringBuilder("\n")
				.append(LOG_OUT).append(RESPONSE).append("\n")
				.append(LOG_OUT).append(requestMethodAndPathUri).append("\n")
			 	.append(LOG_OUT).append(status).append("\n")
			 	.append(LOG_OUT).append(HEADERS).append("\n")
			 	.append(headers).append("\n")
				.toString();
		log.info(logRequest);	
	}
	
	private Map<String, String> getRequestHeaders(HttpServletRequest request) {
		Map<String, String> headersMap = new HashMap<String, String>();

		Enumeration<String> headersName = request.getHeaderNames();
		if(headersName == null) {
			return headersMap;
		}
		
		while (headersName.hasMoreElements()) {
			String headerName  = (String) headersName.nextElement();
			String headerValue = request.getHeader(headerName);
			headersMap.put(headerName, headerValue);
		}
		return headersMap;
	}
	
	private String getResponseHeaders(HttpServletResponse response) {
		Map<String, String> headersMap = new HashMap<String, String>();

		Collection<String> headersNameColection = response.getHeaderNames();
		if(headersNameColection == null || headersNameColection.isEmpty()) {
			return this.getHeadersString(headersMap, LOG_OUT);
		}
		headersNameColection.forEach(headerName -> {
			String headerValue = response.getHeader(headerName);
			headersMap.put(headerName, headerValue);
		});
		return this.getHeadersString(headersMap, LOG_OUT);
	}
	
	private String getHeadersString(Map<String, String> headersMap, String prefix) {
		if(headersMap == null || headersMap.entrySet().isEmpty()) {
			return null;
		}
		StringBuilder headerString = new StringBuilder();
		for(Entry<String, String> entry: headersMap.entrySet()) {
			headerString.append(String.format("%s%s:  %s\n", prefix, entry.getKey(), entry.getValue()));
		}
		
		return headerString.toString().substring(0, headerString.length() - 1);
	}
}