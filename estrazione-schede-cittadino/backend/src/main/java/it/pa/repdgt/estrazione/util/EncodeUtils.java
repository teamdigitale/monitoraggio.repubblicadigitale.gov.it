package it.pa.repdgt.estrazione.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Nella vista il codice fiscale e' memorizzato come hash SHA-256: per cercare
 * un CF in chiaro occorre ricalcolarne lo stesso hash. Il criterio di ricerca
 * viaggia in chiaro dal frontend (nessuna cifratura di trasporto).
 */
public class EncodeUtils {

	private EncodeUtils() {
	}

	public static String encrypt(String valore) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hashBytes = digest.digest(valore.getBytes(StandardCharsets.UTF_8));
			StringBuilder hexString = new StringBuilder();
			for (byte hashByte : hashBytes) {
				String hex = Integer.toHexString(0xff & hashByte);
				if (hex.length() == 1) {
					hexString.append('0');
				}
				hexString.append(hex);
			}
			return hexString.toString();
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossibile elaborare il dato");
		}
	}
}
