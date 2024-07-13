package it.pa.repdgt.surveymgmt.util;

import com.github.mervick.aes_everywhere.Aes256;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class EncodeUtils {

    private static String key = System.getenv("CF_ST_KEY");

    public static String decrypt(String encryptedData) {
        try {
            encryptedData.replace(" ", "+");
            return Aes256.decrypt(encryptedData, key);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Il dato inviato non è corretto");
        }
    }

    public static String encrypt(String decryptedData) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] inputBytes = decryptedData.getBytes(StandardCharsets.UTF_8);
            byte[] hashBytes = digest.digest(inputBytes);
            StringBuilder hexString = new StringBuilder();
            for (byte hashByte : hashBytes) {
                String hex = Integer.toHexString(0xff & hashByte);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossibile salvare il dato");
        }
    }
}
