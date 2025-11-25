package it.pa.repdgt.shared.data;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

/**
 * Wrapper di MultipartFile che contiene il contenuto elaborato (validato e sanitizzato).
 * Utilizzato per restituire file processati dalle utility di upload.
 */
public class ProcessedMultipartFile implements MultipartFile {
	private final byte[] content;
	private final String filename;
	private final String contentType;

	public ProcessedMultipartFile(byte[] content, String filename, String contentType) {
		this.content = content;
		this.filename = filename;
		this.contentType = contentType;
	}

	@Override
	public String getName() {
		return filename;
	}

	@Override
	public String getOriginalFilename() {
		return filename;
	}

	@Override
	public String getContentType() {
		return contentType;
	}

	@Override
	public boolean isEmpty() {
		return content == null || content.length == 0;
	}

	@Override
	public long getSize() {
		return content != null ? content.length : 0;
	}

	@Override
	public byte[] getBytes() throws IOException {
		return content;
	}

	@Override
	public InputStream getInputStream() throws IOException {
		return new ByteArrayInputStream(content != null ? content : new byte[0]);
	}

	@Override
	public void transferTo(java.io.File dest) throws IOException, IllegalStateException {
		try (java.io.FileOutputStream fos = new java.io.FileOutputStream(dest)) {
			if (content != null) {
				fos.write(content);
			}
		}
	}

	@Override
	public void transferTo(java.nio.file.Path dest) throws IOException, IllegalStateException {
		java.nio.file.Files.write(dest, content != null ? content : new byte[0]);
	}
}
