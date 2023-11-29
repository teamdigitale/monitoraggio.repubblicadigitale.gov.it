package it.pa.repdgt.shared.constants;

public interface DomandeStrutturaQ1AndQ2Constants {
	public final String ID_DOMANDA_CODICE_FISCALE = "1";
	public final String ID_DOMANDA_CODICE_FISCALE_NON_DISPONIBILE = "2";
	public final String ID_DOMANDA_TIPO_DOCUMENTO = "3";
	public final String ID_DOMANDA_NUMERO_DOCUMENTO = "4";
	public final String ID_DOMANDA_GENERE = "5";
	public final String ID_DOMANDA_FASCIA_DI_ETA = "6";
	public final String ID_DOMANDA_TITOLO_DI_STUDIO = "7";
	public final String ID_DOMANDA_STATO_OCCUPAZIONALE = "8";
	public final String ID_DOMANDA_PROVINCIA = "9";
	public final String ID_DOMANDA_CITTADINANZA = "10";

	public final String ID_DOMANDA_PRIMA_VOLTA = "20";
	public final String ID_DOMANDA_TIPO_PRIMO_SERVIZIO = "21";

	public final String SEZIONE_Q1_TEMPLATE = "{ "
			+ " \"id\": \"anagraphic-citizen-section\", "
			+ " \"title\": \"Anagrafica del cittadino\", "
			+ " \"properties\": ["
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\", "
			+ "]"
			+ "}";

	public final String SEZIONE_Q2_TEMPLATE = "{ "
			+ " \"id\": \"anagraphic-booking-section\", "
			+ " \"title\": \"Anagrafica della prenotazione\", "
			+ " \"properties\": ["
			+ " \"{'%s': ['%s']}\", "
			+ " \"{'%s': ['%s']}\" "
			+ "]"
			+ "}";
}
