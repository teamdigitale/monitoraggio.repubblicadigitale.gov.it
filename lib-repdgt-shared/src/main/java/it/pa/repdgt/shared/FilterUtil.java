package it.pa.repdgt.shared;

public class FilterUtil {

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
}
