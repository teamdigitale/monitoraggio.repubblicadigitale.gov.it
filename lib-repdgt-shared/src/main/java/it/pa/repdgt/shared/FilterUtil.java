package it.pa.repdgt.shared;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import it.pa.repdgt.shared.repository.BrokenAccessControlRepository;

@Component
public class FilterUtil {
	public static final int SIZE_BUFFER = 128;
	public static final String AUTH_TOKEN_HEADER = "authtoken";
	public static final String USER_ROLE_HEADER  = "userrole";
	public static final String CODICE_RUOLO = "codiceRuoloUtenteLoggato";
	public static final String CODICE_FISCALE = "cfUtenteLoggato";
	public static final String ID_PROGRAMMA = "idProgramma";
	public static final String ID_PROGETTO = "idProgetto";
	public static final String ID_ENTE = "idEnte";
	public static final String DRUPAL_USER = "Drupal_User";
	
	@Autowired
	private BrokenAccessControlRepository brokenAccessControlRepository;
	
	public static final List<String> ENDPOINT_NOT_CHECKED = Arrays.asList(
			"^/open-data*",
			"^/contesto$",
			"^/contesto/confermaIntegrazione$",
			"^/utente/upload/immagineProfilo*",
			"^/utente/download/immagineProfilo*"
	);
	
	public static final List<String> ENDPOINT_SWAGGER = Arrays.asList(			
//			da decommentare in locale(aggiunta endpoint per lanciare swagger):
			"^/swagger-ui*",
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
		
		public static boolean isEndpointSwagger(String endpoint) {
			return endpointMatcher(endpoint, ENDPOINT_SWAGGER);
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

		public boolean verificaSceltaProfilo(String codiceFiscale, String codiceRuolo, String body) throws JsonMappingException, JsonProcessingException {
			ObjectMapper objectMapper = new ObjectMapper();
			final JsonNode jsonNode = objectMapper.readTree(body);
			final ObjectNode objectNode = (ObjectNode) jsonNode;

			JsonNode nodoIdProgramma = objectNode.get(FilterUtil.ID_PROGRAMMA);
			JsonNode nodoIdProgetto = objectNode.get(FilterUtil.ID_PROGETTO);
			JsonNode nodoIdEnte = objectNode.get(FilterUtil.ID_ENTE);
			String idProgramma = nodoIdProgramma != null ? nodoIdProgramma.toString().replace("\"", "") : null;
			String idProgetto = nodoIdProgetto != null ? nodoIdProgetto.toString().replace("\"", "") : null;
			String idEnte = nodoIdEnte != null ? nodoIdEnte.toString().replace("\"", "") : null;
			
			// esclusione api creazione
			boolean sceltaProfiloEmpty = idProgramma == null && idProgetto == null && idEnte == null;
			
			switch (codiceRuolo) {
			case "REG":
			case "DEG":
				if(sceltaProfiloEmpty || brokenAccessControlRepository.isRefDegProgramma(codiceFiscale, codiceRuolo, idProgramma, idEnte) > 0)
					return true;
				break;
			case "REGP":
			case "DEGP":
				if(sceltaProfiloEmpty || brokenAccessControlRepository.isRefDegProgetto(codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte) > 0)
					return true;
				break;
			case "REPP":
			case "DEPP":
				if(sceltaProfiloEmpty || brokenAccessControlRepository.isRefDegPartner(codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte) > 0)
					return true;
				break;
			case "FAC":
			case "VOL":
				if(sceltaProfiloEmpty || brokenAccessControlRepository.isFacVolProgettoAndEnte(codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte) > 0)
					return true;
				break;
			default:
				return true;
			}
			return false;
		}
}
