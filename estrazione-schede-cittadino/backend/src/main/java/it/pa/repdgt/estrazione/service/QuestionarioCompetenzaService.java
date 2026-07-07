package it.pa.repdgt.estrazione.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.estrazione.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.estrazione.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.estrazione.collection.payload.RispostaDomanda;
import it.pa.repdgt.estrazione.collection.payload.SezioneQuestionario;
import it.pa.repdgt.estrazione.repository.QuestionarioCompilatoMongoRepository;
import lombok.extern.slf4j.Slf4j;

/**
 * Estrae dalla collection MongoDB del questionario compilato i valori della
 * sezione servizio (competenza digitale, tipo servizio prenotato) che arricchiscono
 * la scheda cittadino.
 */
@Slf4j
@Service
public class QuestionarioCompetenzaService {

	private static final int SECTION_INDEX_SERVIZIO = 2;
	private static final String PROPERTY_KEY_TIPO_SERVIZIO = "24";
	private static final String PROPERTY_KEY_COMPETENZA = "25";
	private static final String SEPARATORE_VOCI = "; ";
	// Split su ": " preservando "(es.: ..." di alcune voci di competenza. Necessario per il
	// legacy CSV-import che concatena piu' voci in un singolo elemento dell'array.
	private static final Pattern COLON_SPLIT_PATTERN = Pattern.compile("(?<!es\\.):\\s+");
	// Separatore embedded usato in alcuni questionari per concatenare piu' voci in un elemento.
	private static final Pattern SECTION_SIGN_SPLIT_PATTERN = Pattern.compile("§\\s*");

	@Autowired
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;

	public String getCompetenzaDigitale(String idQuestionario) {
		return joinValuesOrNull(extractSezioneServizioPropertyValues(idQuestionario, PROPERTY_KEY_COMPETENZA));
	}

	public String getTipoServizioPrenotato(String idQuestionario) {
		return joinValuesOrNull(extractSezioneServizioPropertyValues(idQuestionario, PROPERTY_KEY_TIPO_SERVIZIO));
	}

	private List<String> extractSezioneServizioPropertyValues(String idQuestionario, String propertyKey) {
		if (idQuestionario == null) {
			return null;
		}

		Optional<QuestionarioCompilatoCollection> mongoDoc = questionarioCompilatoMongoRepository
				.findQuestionarioCompilatoById(idQuestionario);
		if (!mongoDoc.isPresent()) {
			log.debug("Documento MongoDB non trovato per questionario={}", idQuestionario);
			return null;
		}

		List<DatiIstanza> sezioni = mongoDoc.get().getSezioniQuestionarioTemplateIstanze();
		if (sezioni == null || SECTION_INDEX_SERVIZIO >= sezioni.size()) {
			log.debug("Sezione {} non presente nel documento {}", SECTION_INDEX_SERVIZIO, idQuestionario);
			return null;
		}

		SezioneQuestionario sezione = sezioni.get(SECTION_INDEX_SERVIZIO).getSezione();
		if (sezione == null) {
			return null;
		}

		Optional<RispostaDomanda> risposta = sezione.findRisposta(propertyKey);
		if (!risposta.isPresent()) {
			log.debug("Property '{}' non trovata nella sezione servizio del documento {}", propertyKey,
					idQuestionario);
			return null;
		}

		List<String> values = risposta.get().getValori().stream()
				.filter(v -> v != null && !v.isEmpty())
				.flatMap(v -> Arrays.stream(splitValoreLegacy(v)))
				.filter(s -> !s.isEmpty())
				.collect(Collectors.toList());
		return values.isEmpty() ? null : values;
	}

	/**
	 * Spezza un valore legacy in cui piu' voci sono state concatenate con ": "
	 * (CSV-import) o con "§ " (form-fill su alcuni client).
	 */
	private static String[] splitValoreLegacy(String value) {
		List<String> parti = new ArrayList<>();
		for (String byColon : COLON_SPLIT_PATTERN.split(value)) {
			for (String byParagrafo : SECTION_SIGN_SPLIT_PATTERN.split(byColon)) {
				parti.add(byParagrafo);
			}
		}
		return parti.toArray(new String[0]);
	}

	private static String joinValuesOrNull(List<String> values) {
		return (values == null || values.isEmpty()) ? null : String.join(SEPARATORE_VOCI, values);
	}
}
