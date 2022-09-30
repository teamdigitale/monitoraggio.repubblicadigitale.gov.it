package it.pa.repdgt.shared;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FilterUtil {
	public static final int SIZE_BUFFER = 128;
	public static final String AUTH_TOKEN_HEADER = "authtoken";
	public static final String USER_ROLE_HEADER  = "userrole";
	public static final String CODICE_RUOLO = "codiceRuoloUtenteLoggato";
	public static final String CODICE_FISCALE = "cfUtenteLoggato";
	public static final String DRUPAL_USER = "Drupal_User";
	
	public static final List<String> ENDPOINT_NOT_CHECKED = Arrays.asList(
			"^/open-data*",
			"^/contesto$",
			"^/contesto/confermaIntegrazione$",
			"^/utente/upload/immagineProfilo*",
			"^/utente/download/immagineProfilo*"

//			da decommentare in locale(aggiunta endpoint per lanciare swagger):
			,"^/swagger-ui*",
			"^/favicon.ico*",
			"^/swagger-resources*",
			"^/v3/api-docs*",
			"^/v2/api-docs*"
	);

	public static final List<String> ENDPOINT_DRUPAL = Arrays.asList(
			"^/utente/all$",
			"^/gruppo/all$"
	);
	public static final CharSequence VERIFICA_PROFILO_BASE_URI = "/contesto/sceltaProfilo";

	//metodo per il problema di timeout su ambiente di DEV per il match delle REGEXP per far passare le api per anonimo
		//"^/servizio/cittadino/questionarioCompilato/(([A-Za-z0-9]+(\\-?)){1,})/compila/anonimo$",
		//"^/servizio/cittadino/questionarioCompilato/(([A-Za-z0-9]+(\\-?)){1,})/anonimo$"
		public static boolean isEndpointQuestionarioCompilatoAnonimo(String endpoint) {
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
		public static boolean isEndpointQuestionarioCompilato(String endpoint) {
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
		
		public static boolean isEndpointNotChecked(String endpoint) {
			return endpointMatcher(endpoint, ENDPOINT_NOT_CHECKED);
		}
		
		public static boolean isEndpointDrupal(String endpoint) {
			return endpointMatcher(endpoint, ENDPOINT_DRUPAL);
		}
		
		private static boolean endpointMatcher(String endpointToMatch, List<String> listMatch) {
			for(String endpointNonChecked: listMatch) {
				Pattern pattern = Pattern.compile(endpointNonChecked);
			    Matcher matcher = pattern.matcher(endpointToMatch);
				if(matcher.find())
					return true;
			}
			return false;
		}
}
