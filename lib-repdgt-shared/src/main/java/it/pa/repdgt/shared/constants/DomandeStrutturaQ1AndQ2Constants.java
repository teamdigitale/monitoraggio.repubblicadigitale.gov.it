package it.pa.repdgt.shared.constants;

public interface DomandeStrutturaQ1AndQ2Constants {
	public final String ID_DOMANDA_NOME = "1";
	public final String ID_DOMANDA_COGNOME = "2";
	public final String ID_DOMANDA_CODICE_FISCALE = "3";
	public final String ID_DOMANDA_CODICE_FISCALE_NON_DISPONIBILE = "4";
	public final String ID_DOMANDA_TIPO_DOCUMENTO = "5";
	public final String ID_DOMANDA_NUMERO_DOCUMENTO = "6";
	public final String ID_DOMANDA_GENERE = "7";
	public final String ID_DOMANDA_ANNO_DI_NASCITA = "8";
	public final String ID_DOMANDA_TITOLO_DI_STUDIO = "9";
	public final String ID_DOMANDA_STATO_OCCUPAZIONALE = "10";
	public final String ID_DOMANDA_CITTADINANZA = "11";
	public final String ID_DOMANDA_COMUNE_DI_DOMICILIO = "12";
	public final String ID_DOMANDA_CATEGORIE_FRAGILI = "13";
	public final String ID_DOMANDA_EMAIL = "14";
	public final String ID_DOMANDA_PREFISSO = "15";
	public final String ID_DOMANDA_NUMERO_CELLULARE = "16";
	public final String ID_DOMANDA_TELEFONO = "17";
	public final String ID_DOMANDA_TIPO_CONSENSO = "18";
	public final String ID_DOMANDA_DATA_CONSENSO = "19";
	
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
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\" "
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
