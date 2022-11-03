package it.pa.repdgt.shared;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

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
	@Autowired
	private FilterUtil filterUtil;

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
		final String bodyRequest   = wrappedRequest.getBody();

		String metodoHttp = ((HttpServletRequest) request).getMethod();
		String endpoint = ((HttpServletRequest) request).getServletPath();
		/*
		 * aggiunta per le chiamate in arrivo da Drupal
		 */
		if(FilterUtil.DRUPAL_USER.equals(codiceFiscaleUtenteLoggato)) { 
			if(FilterUtil.isEndpointDrupal(endpoint) )
				chain.doFilter(wrappedRequest, response);
			else
				responseHttp.sendError(HttpServletResponse.SC_UNAUTHORIZED, String.format("Utente Non Autorizzato per endpoint: %s %s", metodoHttp, endpoint));
		}else {
			/*
			 * chiamate ad API che non hanno bisogno del controllo dei permessi
			 */
			if(FilterUtil.isEndpointNotChecked(endpoint) 
					/* per risolvere il problema di mysql "Error Code: 3699. Timeout exceeded in regular expression match."
					 * per gli endpoint /servizio/cittadino/questionarioCompilato/.../anonimo che non hanno CF per login
					 */
					|| FilterUtil.isEndpointQuestionarioCompilatoAnonimo(endpoint)) {
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
					/*
					 * controllo per vedere se idProgramma/idProgetto/idEnte sono coerenti con utente e ruolo che chiama API
					 * api drupal/rocketchat/workdocs sono esenti da tale controllo
					 */
					if(bodyRequest != null 
							&& !"".equals(bodyRequest.trim())
							&& !filterUtil.verificaSceltaProfilo(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato, bodyRequest )
							&& !endpoint.contains("/drupal/forward")
							&& !endpoint.contains("/rocket-chat/")
							&& !endpoint.contains("/integrazione/workdocs")
							) {
						responseHttp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente Non Autorizzato");
					}else {
						/*
						 * le seguenti api non hanno bisogno del controllo dei codici permesso
						 */
						if(endpoint.contains(FilterUtil.VERIFICA_PROFILO_BASE_URI) || endpoint.contains("/drupal/forward") || endpoint.contains("/utente/listaUtenti")) {
							chain.doFilter(wrappedRequest, response);
						} else {
							/*
							 * verifica se il profilo dell'utente loggato è abilitato (codici permesso) a poter chiamare quella particolare api
							 */
							List<String> codiciPermessoPerApi;
							if(FilterUtil.isEndpointQuestionarioCompilato(endpoint)) {
								/* per risolvere il problema di mysql "Error Code: 3699. Timeout exceeded in regular expression match."
								 * per l'endpoint /servizio/cittadino/questionarioCompilato/{idQuestionario}/compila
								 */
								codiciPermessoPerApi = Arrays.asList("wrt.quest.citt.serv");	
							}else {
								codiciPermessoPerApi = this.permessiApiService.getCodiciPermessiApiByMetodoHttpAndPath(metodoHttp, endpoint);						
							}
							List<String> codiciPermessoUtenteLoggato = this.permessoService.getCodiciPermessoByUtenteLoggato(codiceFiscaleUtenteLoggato, codiceRuoloUtenteLoggato);

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
		}
	}

	@Override
	public void destroy() {
		log.debug("Filter - destroy");
	}
}