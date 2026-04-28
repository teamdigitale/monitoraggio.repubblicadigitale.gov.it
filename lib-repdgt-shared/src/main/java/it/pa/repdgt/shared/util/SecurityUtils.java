package it.pa.repdgt.shared.util;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Sanitizer e validator riconosciuti dal SAST per mitigare:
 * - V01 Regex Injection (CWE-624)
 * - V02 Path Traversal (CWE-22)
 * - V03 Cross-Site Scripting (CWE-79) lato server
 *
 * Le implementazioni usano esclusivamente API standard del JDK
 * (Path.normalize, Pattern.quote, manipolazione stringhe basata su index)
 * che il taint analyzer di Snyk riconosce come sanitizzatori validi,
 * a differenza delle utility custom in {@link Utils}.
 */
public final class SecurityUtils {

    /** Lunghezza massima accettata per un filename utente. */
    public static final int MAX_FILENAME_LENGTH = 128;

    /**
     * Whitelist di caratteri ammessi in un filename: alfanumerici, punto,
     * trattino e underscore. La regex e' compilata una volta sola per
     * efficienza.
     */
    private static final Pattern SAFE_FILENAME_PATTERN =
            Pattern.compile("^[A-Za-z0-9._-]{1," + MAX_FILENAME_LENGTH + "}$");

    private SecurityUtils() {
        // utility class
    }

    /**
     * Normalizza un filename utente rimuovendo qualsiasi path component
     * e validando contro una whitelist di caratteri sicuri.
     *
     * @param userInput nome file proveniente da input HTTP
     * @return filename sanificato
     * @throws IllegalArgumentException se il nome contiene caratteri non
     *         consentiti o supera la lunghezza massima
     */
    public static String sanitizeFilename(String userInput) {
        if (userInput == null) {
            throw new IllegalArgumentException("filename non puo' essere null");
        }
        // Rimuove qualsiasi path component (Windows e Unix) preservando solo
        // l'ultimo segmento. Path.getFileName e' sanitizer riconosciuto.
        String trimmed = userInput.trim();
        int slash = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
        String baseName = slash >= 0 ? trimmed.substring(slash + 1) : trimmed;

        if (baseName.isEmpty() || baseName.length() > MAX_FILENAME_LENGTH) {
            throw new IllegalArgumentException("filename con lunghezza non valida");
        }
        if (!SAFE_FILENAME_PATTERN.matcher(baseName).matches()) {
            throw new IllegalArgumentException("filename contiene caratteri non consentiti");
        }
        return baseName;
    }

    /**
     * Estrae l'estensione di un filename in modo safe (senza regex).
     * Ritorna stringa vuota se non c'e' estensione.
     */
    public static String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            return "";
        }
        return filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    /**
     * Estrae il base name (senza estensione) in modo safe (senza regex).
     */
    public static String getBaseName(String filename) {
        if (filename == null) {
            return "";
        }
        int dot = filename.lastIndexOf('.');
        return dot < 0 ? filename : filename.substring(0, dot);
    }

    /**
     * Verifica che l'estensione del filename sia presente nella whitelist.
     *
     * @throws IllegalArgumentException se l'estensione non e' ammessa
     */
    public static void validateExtension(String filename, Set<String> allowedExtensions) {
        String ext = getFileExtension(filename);
        if (allowedExtensions == null || !allowedExtensions.contains(ext)) {
            throw new IllegalArgumentException("estensione file non consentita");
        }
    }

    /**
     * Risolve un nome file dentro una directory base e verifica che
     * il path normalizzato non esca dalla base directory (mitigation
     * Path Traversal). Riconosciuto da Snyk come sanitizer.
     *
     * @return Path assoluto e normalizzato dentro baseDir
     * @throws IllegalArgumentException se il path tenta di uscire da baseDir
     */
    public static Path resolveSafePath(Path baseDir, String filename) {
        String safeName = sanitizeFilename(filename);
        Path resolved = baseDir.resolve(safeName).normalize();
        if (!resolved.startsWith(baseDir.normalize())) {
            throw new IllegalArgumentException("path tenta di uscire dalla directory base");
        }
        return resolved;
    }

    /**
     * Variante che accetta una stringa per la base directory.
     */
    public static Path resolveSafePath(String baseDir, String filename) {
        return resolveSafePath(Paths.get(baseDir), filename);
    }

    /**
     * Pattern.quote-based: produce un pattern letterale a partire da input
     * utente per uso sicuro in {@link String#replaceAll(String, String)}.
     */
    public static String quoteLiteral(String userInput) {
        if (userInput == null) {
            return "";
        }
        return Pattern.quote(userInput);
    }

}
