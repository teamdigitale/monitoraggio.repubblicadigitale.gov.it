package it.pa.repdgt.shared;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import it.pa.repdgt.shared.service.PermessoApiService;
import it.pa.repdgt.shared.service.PermessoService;
import it.pa.repdgt.shared.service.RuoloService;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Profile("dev")
public class RequestFilter implements Filter {
	@Autowired
	@Qualifier(value = "ruoloServiceFiltro")
	private RuoloService ruoloService;
	@Autowired
	@Qualifier(value = "permessoServiceFiltro")
	private PermessoService permessoService;
	@Autowired
	private PermessoApiService permessiApiService;
	
	private static final List<String> ENDPOINT_NOT_CHECKED = Arrays.asList(
		"^/open-data*",
		"^/contesto$",
		"^/contesto/confermaIntegrazione$",
		"^/utente/upload/immagineProfilo*",
		"^/utente/download/immagineProfilo*"
		
//      Soluzione su ambienti TEST/PROD dove non esiste problema timeout matcher REGEXP
		//,
		//"^/servizio/cittadino/questionarioCompilato/(([A-Za-z0-9]+(\\-?)){1,})/compila/anonimo$",
		//"^/servizio/cittadino/questionarioCompilato/(([A-Za-z0-9]+(\\-?)){1,})/anonimo$"

//		da decommentare in locale(aggiunta endpoint per lanciare swagger):
		,"^/swagger-ui*",
		"^/favicon.ico*",
		"^/swagger-resources*",
		"^/v3/api-docs*",
		"^/v2/api-docs*"
	);
	private static final CharSequence VERIFICA_PROFILO_BASE_URI = "/contesto/sceltaProfilo";
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		log.debug("Filter - init");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		log.debug("Filter - doFilter - START");
		RequestWrapper wrappedRequest = null;
		HttpServletResponse responseHttp = ((HttpServletResponse) response);
		try {
			wrappedRequest = new RequestWrapper((HttpServletRequest) request);
		} catch (Exception ex) {
			log.error("{}", ex);
			responseHttp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "FILTER ERROR");
			return;
		}

		final String codiceFiscaleUtenteLoggato = wrappedRequest.getCodiceFiscale();
		final String codiceRuoloUtenteLoggato   = wrappedRequest.getCodiceRuolo();
		
		String metodoHttp = ((HttpServletRequest) request).getMethod();
		String endpoint = ((HttpServletRequest) request).getServletPath();
		
		if(isEndpointNotChecked(endpoint) 
				/* per risolvere il problema di mysql "Error Code: 3699. Timeout exceeded in regular expression match."
				 * per gli endpoint /servizio/cittadino/questionarioCompilato/.../anonimo che non hanno CF per login
				 */
				|| isEndpointQuestionarioCompilatoAnonimo(endpoint)) {
			chain.doFilter(wrappedRequest, response);
		} else {
			// verifico se l'utente loggato possiede il ruolo con cui si è profilato
			boolean hasRuoloUtente = this.ruoloService
					.getRuoliByCodiceFiscaleUtente(codiceFiscaleUtenteLoggato)
					.stream()
					.anyMatch(codiceRuolo -> codiceRuolo.equalsIgnoreCase(codiceRuoloUtenteLoggato));
		
			if(!hasRuoloUtente) {
				responseHttp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente Non Autorizzato");
			} else {
				if(endpoint.contains(VERIFICA_PROFILO_BASE_URI)) {
					chain.doFilter(wrappedRequest, response);
				} else {
					List<String> codiciPermessoPerApi;
					if(isEndpointQuestionarioCompilato(endpoint)) {
						/* per risolvere il problema di mysql "Error Code: 3699. Timeout exceeded in regular expression match."
						 * per l'endpoint /servizio/cittadino/questionarioCompilato/{idQuestionario}/compila
						 */
						codiciPermessoPerApi = Arrays.asList("wrt.quest.citt.serv");	
					}else {
						codiciPermessoPerApi = this.permessiApiService.getCodiciPermessiApiByMetodoHttpAndPath(metodoHttp, endpoint);						
					}
					List<String> codiciPermessoUtenteLoggato = this.permessoService.getCodiciPermessoByUtenteLoggato(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato);

					
					
					// verifico il profilo dell'utente loggato è abilitato a poter chiamare quella particolare api
					boolean isUtenteAbilitatoPerApi = false;
					for(String codiciPermesso: codiciPermessoPerApi) {
						if(codiciPermessoUtenteLoggato.contains(codiciPermesso)) {
							isUtenteAbilitatoPerApi = true;
							break;
						}
					}
					
					if(!isUtenteAbilitatoPerApi) {
						responseHttp.sendError(HttpServletResponse.SC_UNAUTHORIZED, String.format("Utente Non Autorizzato per endpoint: %s %s", metodoHttp, endpoint));
					}else {
						chain.doFilter(wrappedRequest, response);
					}
				}
				
			}
		}
		
	}

	@Override
	public void destroy() {
		log.debug("Filter - destroy");
	}
	
	private boolean isEndpointNotChecked(String endpoint) {
		for(String endpointNonChecked: ENDPOINT_NOT_CHECKED) {
			Pattern pattern = Pattern.compile(endpointNonChecked);
		    Matcher matcher = pattern.matcher(endpoint);
			if(matcher.find())
				return true;
		}
		return false;
	}

	//metodo per il problema di timeout su ambiente di DEV per il match delle REGEXP per far passare le api per anonimo
	//"^/servizio/cittadino/questionarioCompilato/(([A-Za-z0-9]+(\\-?)){1,})/compila/anonimo$",
	//"^/servizio/cittadino/questionarioCompilato/(([A-Za-z0-9]+(\\-?)){1,})/anonimo$"
	private boolean isEndpointQuestionarioCompilatoAnonimo(String endpoint) {
		String [] endpointQuestionarioCompilato =  endpoint.split("/"); 
		if(endpointQuestionarioCompilato.length > 3) {
				if(endpointQuestionarioCompilato[1].equals("servizio") &&
						endpointQuestionarioCompilato[2].equals("cittadino") &&
						endpointQuestionarioCompilato[3].equals("questionarioCompilato")) {
					if((endpointQuestionarioCompilato.length == 6 && endpointQuestionarioCompilato[5].equals("anonimo")) ||
							(endpointQuestionarioCompilato.length == 7 && endpointQuestionarioCompilato[6].equals("anonimo")))
						return true;
				}
		}
		return false;
	}
	
	//metodo per il problema di timeout su ambiente di DEV per il match delle REGEXP per fare il check 
	//dell'api "^/servizio/cittadino/questionarioCompilato/(([A-Za-z0-9]+(\\-?)){1,})/compila$"
	private boolean isEndpointQuestionarioCompilato(String endpoint) {
		String [] endpointQuestionarioCompilato =  endpoint.split("/"); 
		if(endpointQuestionarioCompilato.length == 6) {
				if(endpointQuestionarioCompilato[1].equals("servizio") &&
						endpointQuestionarioCompilato[2].equals("cittadino") &&
						endpointQuestionarioCompilato[3].equals("questionarioCompilato")) {
					if(endpointQuestionarioCompilato[5].equals("compila"))
							return true;
				}
		}
		return false;
	}
}