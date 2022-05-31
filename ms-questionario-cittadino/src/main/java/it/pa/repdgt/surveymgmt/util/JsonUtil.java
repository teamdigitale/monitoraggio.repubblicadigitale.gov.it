package it.pa.repdgt.surveymgmt.util;

import java.util.Base64;

import javax.validation.ConstraintViolationException;

import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.surveymgmt.annotation.JsonString;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import lombok.extern.slf4j.Slf4j;

@Validated
@Slf4j
public class JsonUtil {

	/**
	 * Restituisce una stringa in formato JSON 
	 * a partire da una stringa che rappresenta la codifica in 
	 * Base64 di un file
	 * */
	public static String getJson(String fileCodificatoInBase64) {
		log.debug("getJson(String fileBase64Encoded) - START");
		if(fileCodificatoInBase64 == null) { 
			return null;
		}
		
		try {
			byte[] bytesFileDecoded = Base64.getDecoder().decode(fileCodificatoInBase64);
			@JsonString String jsonString = new String(bytesFileDecoded);
			return jsonString;
		}catch (IllegalArgumentException ex) {
			log.error("ex={}", ex);
			throw new QuestionarioTemplateException("Impossibile decodificare il file codificato in Base64", ex);
		}catch (ConstraintViolationException ex) {
			log.error("ex={}", ex);
			throw new QuestionarioTemplateException("Il file codificato in Base64 non rapprsenta un JSON ben formato", ex);
		} catch (Exception ex) {
			log.error("ex={}", ex);
			throw new QuestionarioTemplateException("Errore genrico nella decodifica del json in Base64", ex);
		}
	}
}