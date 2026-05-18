package it.pa.repdgt.surveymgmt.collection.payload;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Rappresenta il payload JSON contenuto nel campo "question-answer" di
 * una sezione del questionario.
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SezioneQuestionario {

	private String id;
	private String title;
	private List<RispostaDomanda> properties;

	public Optional<SezioneId> getSezioneId() {
		return SezioneId.fromId(id);
	}

	public List<RispostaDomanda> getProperties() {
		return properties == null ? Collections.emptyList() : properties;
	}

	/**
	 * Restituisce la prima risposta che ha il codiceDomanda indicato.
	 */
	public Optional<RispostaDomanda> findRisposta(String codiceDomanda) {
		if (codiceDomanda == null) {
			return Optional.empty();
		}
		return getProperties().stream().filter(p -> p != null && codiceDomanda.equals(p.getCodiceDomanda())).findFirst();
	}
}
