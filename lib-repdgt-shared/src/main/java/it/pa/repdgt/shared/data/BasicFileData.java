package it.pa.repdgt.shared.data;

import java.math.BigDecimal;

public class BasicFileData {

	protected byte[] file;
	protected String nomeFile;
	protected String estensione;
	protected String mimeType;

	public BasicFileData() {
		super();
	}

	public BasicFileData(byte[] file, String nomeFile, String estensione, String mimeType) {
		super();
		this.file = file;
		this.nomeFile = nomeFile;
		this.estensione = estensione;
		this.mimeType = mimeType;
	}

	public BigDecimal getFileSize() {
		if (file != null) {
			int fileLength = file.length;
			return new BigDecimal(fileLength / 1024);
		} else {
			return new BigDecimal(0);
		}
	}

	public BigDecimal getFileSizeByte() {
		if (file != null) {
			int fileLength = file.length;
			return new BigDecimal(fileLength);
		} else {
			return new BigDecimal(0);
		}
	}

	public String getNomeFile() {
		return nomeFile;
	}

	public void setNomeFile(String nomeFile) {
		this.nomeFile = nomeFile;
	}

	public String getEstensione() {
		return estensione;
	}

	public void setEstensione(String estensione) {
		this.estensione = estensione;
	}

	public byte[] getFile() {
		return file;
	}

	public void setFile(byte[] file) {
		this.file = file;
	}

	public String getMimeType() {
		return mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

}
