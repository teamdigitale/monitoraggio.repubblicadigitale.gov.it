package it.pa.repdgt.shared.constants;

public interface DomandeStrutturaQ1AndQ2Constants {
	public final String ID_DOMANDA_NOME = "1";
	public final String ID_DOMANDA_COGNOME = "2";
	public final String ID_DOMANDA_CODICE_FISCALE = "3";
	public final String ID_DOMANDA_TIPO_DOCUMENTO = "4";
	public final String ID_DOMANDA_NUMERO_DOCUMENTO = "5";
	public final String ID_DOMANDA_GENERE = "6";
	public final String ID_DOMANDA_ANNO_DI_NASCITA = "7";
	public final String ID_DOMANDA_TITOLO_DI_STUDIO = "8";
	public final String ID_DOMANDA_STATO_OCCUPAZIONALE = "9";
	public final String ID_DOMANDA_CITTADINANZA = "10";
	public final String ID_DOMANDA_COMUNE_DI_DOMICILIO = "11";
	public final String ID_DOMANDA_CATEGORIE_FRAGILI = "12";
	public final String ID_DOMANDA_EMAIL = "13";
	public final String ID_DOMANDA_PREFISSO = "14";
	public final String ID_DOMANDA_NUMERO_CELLULARE = "15";
	public final String ID_DOMANDA_TELEFONO = "16";
	public final String ID_DOMANDA_TIPO_CONSENSO = "17";
	public final String ID_DOMANDA_DATA_CONSENSO = "18";
	
	public final String ID_DOMANDA_PRIMA_VOLTA = "19";
	public final String ID_DOMANDA_TIPO_PRIMO_SERVIZIO = "20";

	
	public final String SEZIONE_Q1_TEMPLATE = "{ "
			+ " \"id\": \"Q1\", "
			+ " \"title\": \"Sezione Q1\", "
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
					+ " \"{'%s': ['%s']}\" "
				+ "]"
			+ "}";
	
	public final String SEZIONE_Q2_TEMPLATE = "{ "
			+ " \"id\": \"Q2\", "
			+ " \"title\": \"Sezione Q2\", "
			+ " \"properties\": ["
					+ " \"{'%s': ['%s']}\", "
					+ " \"{'%s': ['%s']}\" "
				+ "]"
			+ "}";
}
