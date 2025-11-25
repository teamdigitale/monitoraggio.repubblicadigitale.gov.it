package it.pa.repdgt.shared.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.Arrays;
import java.util.HashSet;
import javax.imageio.ImageIO;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.springframework.web.multipart.MultipartFile;
import it.pa.repdgt.shared.data.ProcessedMultipartFile;
import it.pa.repdgt.shared.data.BasicFileData;


public class Utils {

	public static String toCamelCase(String str) {
		String[] strCamel = str.split(" ");
		String strResult = "";
		for(int i = 0; i < strCamel.length; i++) {
			if(i > 0)
				strResult += " " + strCamel[i].substring(0,1).toUpperCase() + strCamel[i].substring(1).toLowerCase();
			else
				strResult += strCamel[i].substring(0,1).toUpperCase() + strCamel[i].substring(1).toLowerCase();
		}
		return strResult;
	}

	public static String decompressGzip(byte[] compressed) throws IOException {
        try (InputStream is = new GzipCompressorInputStream(new ByteArrayInputStream(compressed))) {
            return new String(readAllBytes(is), StandardCharsets.UTF_8);
        }
    }

	private static byte[] readAllBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[16384];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return buffer.toByteArray();
    }

	// --- File upload helpers ---
	// Image extensions
	public static final Set<String> ALLOWED_IMAGE_EXT = new HashSet<>(Arrays.asList("jpg", "jpeg", "png", "gif", "webp"));
	// Document extensions
	public static final Set<String> ALLOWED_DOCUMENT_EXT = new HashSet<>(Arrays.asList("txt", "rtf", "odt", "docx", "doc", "pdf"));
	// Spreadsheet extensions
	public static final Set<String> ALLOWED_SPREADSHEET_EXT = new HashSet<>(Arrays.asList("xls", "xlsx", "csv"));
	// Presentation extensions
	public static final Set<String> ALLOWED_PRESENTATION_EXT = new HashSet<>(Arrays.asList("ppt", "pptx"));
	// Video extensions
	public static final Set<String> ALLOWED_VIDEO_EXT = new HashSet<>(Arrays.asList("mpg", "wmv"));
	// Archive extensions
	public static final Set<String> ALLOWED_ARCHIVE_EXT = new HashSet<>(Arrays.asList("zip"));
	// Executable extensions (high risk - consider blocking)
	public static final Set<String> ALLOWED_EXECUTABLE_EXT = new HashSet<>(Arrays.asList("exe"));
	// All allowed extensions combined
	public static final Set<String> DEFAULT_ALLOWED_EXT = new HashSet<>(Arrays.asList(
		"jpg", "jpeg", "png", "gif", "webp",
		"txt", "rtf", "odt", "docx", "doc", "pdf",
		"xls", "xlsx", "csv",
		"ppt", "pptx",
		"mpg", "wmv",
		"zip", "exe"
	));

	public static final Set<String> ALL_ALLOWED_EXT;
	static {
		ALL_ALLOWED_EXT = new HashSet<>();
		ALL_ALLOWED_EXT.addAll(ALLOWED_IMAGE_EXT);
		ALL_ALLOWED_EXT.addAll(ALLOWED_DOCUMENT_EXT);
		ALL_ALLOWED_EXT.addAll(ALLOWED_SPREADSHEET_EXT);
		ALL_ALLOWED_EXT.addAll(ALLOWED_PRESENTATION_EXT);
		ALL_ALLOWED_EXT.addAll(ALLOWED_VIDEO_EXT);
		ALL_ALLOWED_EXT.addAll(ALLOWED_ARCHIVE_EXT);
		ALL_ALLOWED_EXT.addAll(ALLOWED_EXECUTABLE_EXT);
	}
	public static final long DEFAULT_MAX_SIZE = 10L * 1024L * 1024L; // 10 MB

	/**
	 * Esegue tutti i controlli e processa un MultipartFile.
	 * Per immagini: ricodifica per rimuovere metadata. Per altri file: senza modifica.
	 * Restituisce un MultipartFile elaborato con contenuto validato e filename sanitizzato.
	 */
	public static MultipartFile processAndClean(MultipartFile file, long maxSizeBytes, Set<String> allowedExtensions, String filenamePrefix) throws IOException {
		validateFile(file, maxSizeBytes, allowedExtensions);
		String ext = getExtension(file.getOriginalFilename());
		byte[] cleaned;
		if (isImageExtension(ext)) {
			cleaned = stripMetadataAndReencode(file, ext);
		} else {
			cleaned = fileToBytes(file);
		}
		String safeName = generateSafeFilename(file.getOriginalFilename(), filenamePrefix);
		String contentType = file.getContentType() != null ? file.getContentType() : guessContentTypeFromExt(ext);
		return new ProcessedMultipartFile(cleaned, safeName, contentType);
	}

	/**
	 * Esegue tutti i controlli e processa un'immagine fornita come byte[].
	 * Per immagini: ricodifica per rimuovere metadata. Per altri file: senza modifica.
	 * originalFilename può essere null ma è consigliato per ricavare estensione/nome sicuro.
	 * contentType può essere null, verrà dedotto dalle magic bytes / estensione.
	 * Restituisce un BasicFileData con contenuto elaborato, nome file e tipo MIME.
	 */
	public static BasicFileData processAndClean(byte[] data, String originalFilename, String contentType, long maxSizeBytes, Set<String> allowedExtensions, String filenamePrefix) throws IOException {
		validateFile(data, originalFilename, maxSizeBytes, allowedExtensions);
		String ext = getExtension(originalFilename);
		byte[] cleaned;
		if (isImageExtension(ext)) {
			cleaned = stripMetadataAndReencode(data, ext);
		} else {
			cleaned = data;
		}
		String safeName = generateSafeFilename(originalFilename != null ? originalFilename : "file", filenamePrefix);
		String finalContentType = contentType != null ? contentType : guessContentTypeFromExt(ext);
		return new BasicFileData(cleaned, safeName, ext, finalContentType);
	}

	public static void validateFile(MultipartFile file, long maxSizeBytes, Set<String> allowedExtensions) throws IOException {
		if (file == null || file.isEmpty()) throw new IllegalArgumentException("File mancante o vuoto");
		if (file.getSize() > maxSizeBytes) throw new IllegalArgumentException("File troppo grande");
		String ext = getExtension(file.getOriginalFilename());
		if (ext == null || !allowedExtensions.contains(ext.toLowerCase(Locale.ROOT)))
			throw new IllegalArgumentException("Estensione non permessa");
		if (!isValidFileByMagicBytes(fileToBytes(file), ext)) throw new IllegalArgumentException("Contenuto del file non valido");
	}

	// Backward compatibility alias
	public static void validateImage(MultipartFile file, long maxSizeBytes, Set<String> allowedExtensions) throws IOException {
		validateFile(file, maxSizeBytes, allowedExtensions);
	}

	public static void validateFile(byte[] data, String originalFilename, long maxSizeBytes, Set<String> allowedExtensions) throws IOException {
		if (data == null || data.length == 0) throw new IllegalArgumentException("File mancante o vuoto");
		if (data.length > maxSizeBytes) throw new IllegalArgumentException("File troppo grande");
		String ext = getExtension(originalFilename);
		if (ext == null || !allowedExtensions.contains(ext.toLowerCase(Locale.ROOT)))
			throw new IllegalArgumentException("Estensione non permessa");
		if (!isValidFileByMagicBytes(data, ext)) throw new IllegalArgumentException("Contenuto del file non valido");
	}

	// Backward compatibility alias
	public static void validateImage(byte[] data, String originalFilename, String contentType, long maxSizeBytes, Set<String> allowedExtensions) throws IOException {
		validateFile(data, originalFilename, maxSizeBytes, allowedExtensions);
	}

	public static String sanitizeFilename(String original) {
		if (original == null) return "";
		String safe = Paths.get(original).getFileName().toString();
		return safe.replaceAll("[^A-Za-z0-9._-]", "_");
	}

	public static String getExtension(String filename) {
		if (filename == null) return null;
		String name = Paths.get(filename).getFileName().toString();
		int idx = name.lastIndexOf('.');
		if (idx <= 0 || idx == name.length() - 1) return null;
		return name.substring(idx + 1).toLowerCase(Locale.ROOT);
	}

	private static String guessContentTypeFromExt(String ext) {
		if (ext == null) return "application/octet-stream";
		String e = ext.toLowerCase(Locale.ROOT);
		switch (e) {
			// Image
			case "jpg":
			case "jpeg": return "image/jpeg";
			case "png": return "image/png";
			case "gif": return "image/gif";
			case "webp": return "image/webp";
			// Documents
			case "pdf": return "application/pdf";
			case "doc": return "application/msword";
			case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
			case "rtf": return "application/rtf";
			case "txt": return "text/plain";
			case "odt": return "application/vnd.oasis.opendocument.text";
			// Spreadsheet
			case "xls": return "application/vnd.ms-excel";
			case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			case "csv": return "text/csv";
			// Presentation
			case "ppt": return "application/vnd.ms-powerpoint";
			case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
			// Video
			case "mpg": return "video/mpeg";
			case "wmv": return "video/x-ms-wmv";
			// Archive
			case "zip": return "application/zip";
			// Executable
			case "exe": return "application/x-msdownload";
			default: return "application/octet-stream";
		}
	}

	private static boolean isImageExtension(String ext) {
		return ext != null && ALLOWED_IMAGE_EXT.contains(ext.toLowerCase(Locale.ROOT));
	}

	public static boolean isValidFileByMagicBytes(byte[] data, String ext) {
		if (data == null || data.length < 2) return false;
		if (ext == null) return false;
		String e = ext.toLowerCase(Locale.ROOT);
		
		// Image formats
		if (e.equals("jpg") || e.equals("jpeg")) {
			if ((data[0] & 0xFF) == 0xFF && (data[1] & 0xFF) == 0xD8) return true;
		}
		if (e.equals("png")) {
			if (data.length >= 8 && (data[0] & 0xFF) == 0x89 && data[1] == 'P' && data[2] == 'N' && data[3] == 'G') return true;
		}
		if (e.equals("gif")) {
			if (data.length >= 4 && data[0] == 'G' && data[1] == 'I' && data[2] == 'F' && data[3] == '8') return true;
		}
		if (e.equals("webp")) {
			if (data.length >= 12 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F' &&
				data[8] == 'W' && data[9] == 'E' && data[10] == 'B' && data[11] == 'P') return true;
		}
		
		// PDF
		if (e.equals("pdf")) {
			if (data.length >= 4 && data[0] == '%' && data[1] == 'P' && data[2] == 'D' && data[3] == 'F') return true;
		}
		
		// ZIP (also DOCX, XLSX, PPTX, ODP, ODT)
		if (e.equals("zip") || e.equals("docx") || e.equals("xlsx") || e.equals("pptx") || e.equals("odt")) {
			if (data.length >= 4 && data[0] == 'P' && data[1] == 'K' && data[2] == 0x03 && data[3] == 0x04) return true;
		}
		
		// DOC, XLS, PPT (Microsoft Office Old Format)
		if (e.equals("doc") || e.equals("xls") || e.equals("ppt")) {
			if (data.length >= 8 && data[0] == (byte)0xD0 && data[1] == (byte)0xCF && data[2] == 0x11 && data[3] == (byte)0xE0) return true;
		}
		
		// RTF
		if (e.equals("rtf")) {
			if (data.length >= 5 && data[0] == '{' && data[1] == '\\' && data[2] == 'r' && data[3] == 't' && data[4] == 'f') return true;
		}
		
		// CSV and TXT (plain text) - more lenient
		if (e.equals("csv") || e.equals("txt")) {
			return true; // Allow plain text
		}
		
		// MPEG
		if (e.equals("mpg")) {
			if (data.length >= 3 && data[0] == (byte)0x00 && data[1] == (byte)0x00 && data[2] == 0x01) return true;
			if (data.length >= 4 && data[0] == (byte)0xFF && (data[1] & 0xE0) == 0xE0) return true; // MPEG audio frames
		}
		
		// WMV (Windows Media Video) - RIFF format
		if (e.equals("wmv")) {
			if (data.length >= 12 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F') return true;
		}
		
		// EXE (PE format)
		if (e.equals("exe")) {
			if (data.length >= 2 && data[0] == 'M' && data[1] == 'Z') return true; // MZ header
		}
		
		return false; // Default: file type not recognized or not validated
	}

	public static boolean isImageByMagicBytes(byte[] data) {
		if (data == null || data.length < 3) return false;
		if ((data[0] & 0xFF) == 0xFF && (data[1] & 0xFF) == 0xD8 && (data[2] & 0xFF) == 0xFF) return true; // JPEG
		if (data.length >= 8 && (data[0] & 0xFF) == 0x89 && data[1] == 'P' && data[2] == 'N' && data[3] == 'G') return true; // PNG
		if (data.length >= 4 && data[0] == 'G' && data[1] == 'I' && data[2] == 'F' && data[3] == '8') return true; // GIF
		if (data.length >= 12 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F' &&
			data[8] == 'W' && data[9] == 'E' && data[10] == 'B' && data[11] == 'P') return true; // WEBP
		return false;
	}

	public static byte[] fileToBytes(MultipartFile file) throws IOException {
		try (InputStream is = file.getInputStream(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
			byte[] buf = new byte[8192];
			int r;
			while ((r = is.read(buf)) != -1) baos.write(buf, 0, r);
			return baos.toByteArray();
		}
	}

	public static byte[] stripMetadataAndReencode(byte[] data, String ext) throws IOException {
		BufferedImage img = ImageIO.read(new ByteArrayInputStream(data));
		if (img == null) throw new IOException("Impossibile leggere immagine");
		String fmt = normaliseFormat(ext);
		try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
			ImageIO.write(img, fmt, baos);
			return baos.toByteArray();
		}
	}

	public static byte[] stripMetadataAndReencode(MultipartFile file, String ext) throws IOException {
		return stripMetadataAndReencode(fileToBytes(file), ext);
	}

	private static String normaliseFormat(String ext) {
		if (ext == null) return "png";
		String e = ext.toLowerCase(Locale.ROOT);
		if (e.equals("jpeg")) return "jpg";
		if (e.equals("webp")) return "png"; // fallback: ImageIO may not support webp
		if (Arrays.asList("jpg","jpeg","png","gif").contains(e)) return e.equals("jpeg") ? "jpg" : e;
		return "png";
	}

	public static String generateSafeFilename(String original, String prefix) {
		String ext = getExtension(original);
		String base = sanitizeFilename(original == null ? "file" : original);
		if (ext != null) base = base.replaceAll("\\." + ext + "$", "");
		String uuid = UUID.randomUUID().toString();
		StringBuilder sb = new StringBuilder();
		if (prefix != null && !prefix.trim().isEmpty()) sb.append(sanitizeFilename(prefix)).append("-");
		sb.append(base).append("-").append(uuid);
		if (ext != null) sb.append(".").append(ext);
		return sb.toString();
	}
}
