package it.pa.repdgt.opendata.exception;

import java.io.Serializable;

public class OpenDataCSVExportException extends RuntimeException implements Serializable {
	private static final long serialVersionUID = -6942993187623164713L;

	public OpenDataCSVExportException(String excMessage, Throwable throwable) {
		super(excMessage, throwable);
	}
}
