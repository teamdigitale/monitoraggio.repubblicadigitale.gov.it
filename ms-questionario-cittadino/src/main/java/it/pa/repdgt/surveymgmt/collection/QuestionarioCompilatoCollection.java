package it.pa.repdgt.surveymgmt.collection;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.bson.json.JsonObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.surveymgmt.collection.payload.SezioneQuestionario;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * Classe QuestionarioTemplateIstanzaCollection mappa un template di questionario.
 *
 * */
@Document(collection = "questionarioTemplateIstanza")
@Setter
@Getter
public class QuestionarioCompilatoCollection implements Serializable {
	private static final long serialVersionUID = -5135985858663895848L;

	@Id
	private String mongoId;

	@NotNull
	@Field(name = "id")
	private String idQuestionarioCompilato;

	@Field(name = "sections")
	private List<DatiIstanza> sezioniQuestionarioTemplateIstanze = new ArrayList<>();

	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraCreazione")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraAggiornamento")
	private Date dataOraUltimoAggiornamento;

	@Setter
	@Getter
	@Slf4j
	public static class DatiIstanza implements Serializable {
		private static final long serialVersionUID = -5883239875068845224L;

		private static final ObjectMapper TOLERANT_MAPPER = new ObjectMapper()
				.configure(JsonReadFeature.ALLOW_SINGLE_QUOTES.mappedFeature(), true)
				.configure(JsonReadFeature.ALLOW_UNQUOTED_FIELD_NAMES.mappedFeature(), true);

		@Field(name = "question-answer")
		@NotNull
		private Object domandaRisposta;

		@Transient
		@JsonIgnore
		private transient SezioneQuestionario sezioneCache;

		/**
		 * Parsa il contenuto JSON di {@code domandaRisposta} nel POJO
		 * {@link SezioneQuestionario}, tollerando apici singoli legacy.
		 * Il risultato viene cacheato per la vita dell'istanza.
		 */
		public SezioneQuestionario getSezione() {
			if (sezioneCache != null) {
				return sezioneCache;
			}
			if (domandaRisposta == null) {
				return null;
			}
			String json = estraiJson(domandaRisposta);
			if (json == null || json.isEmpty()) {
				return null;
			}
			try {
				sezioneCache = TOLERANT_MAPPER.readValue(json, SezioneQuestionario.class);
			} catch (IOException e) {
				log.warn("Parsing JSON sezione fallito: {}", e.getMessage());
				return null;
			}
			return sezioneCache;
		}

		private static String estraiJson(Object domandaRisposta) {
			if (domandaRisposta instanceof JsonObject) {
				return ((JsonObject) domandaRisposta).getJson();
			}
			return domandaRisposta.toString();
		}
	}
}
