package it.pa.repdgt.shared.util;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * Utility per la sanificazione e validazione degli URL
 * Implementa controlli di sicurezza basati su path intermedi consentiti
 */
@Slf4j
public class UrlSanitizationUtil {

	public static final List<String> ENDPOINT_RUOLI = Arrays.asList(
			"^/api/board/items$",
			"^/api/board/items_social$",
			"^/api/board/item/[A-Za-z0-9]+/user/[A-Za-z0-9]+$",
			"^/api/search/board/items$",
			"^/api/document/items$",
			"^/api/document/items_social$",
			"^/api/document/item/[A-Za-z0-9]+/user/[A-Za-z0-9]+$",
			"^/api/search/document/items$",
			"^/api/board/filters$",
			"^/api/document/filters$"
	);

	/**
	 * Lista di path intermedi consentiti. Questi path devono essere presenti nell'URL
	 * per essere considerato sicuro. Ad esempio: "/api/board/", "/api/document/", etc.
	 */
	public static final List<String> ALLOWED_PATH_SEGMENTS = Arrays.asList(
		"/api/board/",
		"/api/document/",
		"/api/search/",
		"/api/filters/",
		"/api/category/",
		"/api/program/",
		"/api/comment/",
		"/api/item/",
		"/api/user/",
		"/api/community",
		"/api/tags/",
		"/api/reports"
	);

	/**
	 * Pattern per rilevare caratteri/sequenze sospette (traversal, injection, etc.)
	 */
	private static final List<Pattern> SUSPICIOUS_PATTERNS = Arrays.asList(
		Pattern.compile("\\.\\.(/|\\\\)"),           // Path traversal: ../
		//Pattern.compile("[;`|&$()]"),                // Command injection characters
		Pattern.compile("(javascript:|data:|vbscript:)"), // Protocol injection
		Pattern.compile("[<>\"'%]"),                 // HTML/XML injection
		Pattern.compile("(union|select|insert|update|delete|drop)\\s", Pattern.CASE_INSENSITIVE) // SQL injection (base)
	);

	/**
	 * Valida che l'URL sia sicuro basandosi su:
	 * 1. Sintassi URL valida
	 * 2. Presenza di almeno uno dei path intermedi consentiti
	 * 3. Assenza di pattern sospetti
	 *
	 * @param urlPath il path dell'URL da validare (es: "/api/board/items?filter=test")
	 * @throws RuntimeException se l'URL non passa i controlli di sicurezza
	 */
	public static void validateUrl(String urlPath) {
		// 1. Controllo null/vuoto
		if (StringUtils.isBlank(urlPath)) {
			String msg = "URL path non può essere vuoto";
			log.warn("URL Sanitization: {}", msg);
			throw new RuntimeException(msg);
		}

		// 2. Controllo sintassi URL (almeno struttura di base)
		try {
			String testUrl = "http://localhost" + urlPath;
			new URL(testUrl);
		} catch (MalformedURLException e) {
			String msg = "URL malformato: " + urlPath;
			log.warn("URL Sanitization: {}", msg);
			throw new RuntimeException(msg, e);
		}

		// 3. Controllo pattern sospetti
		for (Pattern pattern : SUSPICIOUS_PATTERNS) {
			if (pattern.matcher(urlPath).find()) {
				String msg = String.format("URL contiene pattern sospetto: %s", urlPath);
				log.warn("URL Sanitization: {}", msg);
				throw new RuntimeException(msg);
			}
		}

		// 4. Controllo presenza almeno uno dei path intermedi consentiti
		boolean hasAllowedPath = ALLOWED_PATH_SEGMENTS.stream()
			.anyMatch(segment -> urlPath.contains(segment));

		if (!hasAllowedPath) {
			String msg = String.format("URL non contiene nessuno dei path consentiti: %s", urlPath);
			log.warn("URL Sanitization: URL non autorizzato - {}", msg);
			throw new RuntimeException(msg);
		}

		log.debug("URL validato con successo: {}", urlPath);
	}

	/**
	 * Variante che ritorna boolean invece di lanciare eccezione
	 * (utile per logging/audit senza bloccare)
	 * 
	 * @param urlPath il path dell'URL da validare
	 * @return true se l'URL è sicuro, false altrimenti
	 */
	public static boolean isUrlSafe(String urlPath) {
		try {
			validateUrl(urlPath);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * Aggiungi un path intermedio alla lista bianca (runtime)
	 * 
	 * @param pathSegment il path da aggiungere (es: "/api/newendpoint/")
	 */
	public static void addAllowedPathSegment(String pathSegment) {
		if (StringUtils.isNotBlank(pathSegment) && !ALLOWED_PATH_SEGMENTS.contains(pathSegment)) {
			ALLOWED_PATH_SEGMENTS.add(pathSegment);
			log.info("Path segment aggiunto alla whitelist: {}", pathSegment);
		}
	}

	/**
	 * Ottiene la lista di path intermedi consentiti (copia per evitare modifiche esterne)
	 * 
	 * @return lista dei path intermedi consentiti
	 */
	public static List<String> getAllowedPathSegments() {
		return Arrays.asList(ALLOWED_PATH_SEGMENTS.toArray(new String[0]));
	}
}
