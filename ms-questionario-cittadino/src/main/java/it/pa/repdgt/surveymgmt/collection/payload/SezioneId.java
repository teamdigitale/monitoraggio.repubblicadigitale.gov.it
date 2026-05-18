package it.pa.repdgt.surveymgmt.collection.payload;

import java.util.Arrays;
import java.util.Optional;

/**
 * Identificativi delle sezioni del questionario compilato come salvate
 * nel campo "id" del JSON di ogni section.
 */
public enum SezioneId {

	ANAGRAPHIC_CITIZEN("anagraphic-citizen-section"),
	ANAGRAPHIC_BOOKING("anagraphic-booking-section"),
	ANAGRAPHIC_SERVICE("anagraphic-service-section"),
	CONTENT_SERVICE("content-service-section");

	private final String id;

	SezioneId(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public static Optional<SezioneId> fromId(String id) {
		if (id == null) {
			return Optional.empty();
		}
		return Arrays.stream(values())
				.filter(s -> s.id.equalsIgnoreCase(id))
				.findFirst();
	}
}
