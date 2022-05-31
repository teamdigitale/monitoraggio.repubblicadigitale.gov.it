package it.pa.repdgt.gestioneutente.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.exception.UtenteException;


public class CSVUtil {
	private static final List<String> HEADERS = Arrays.asList(
			"ID", 
			"NOME", 
			"RUOLO", 
			"STATO"
		);

	public static ByteArrayInputStream exportCSVUtenti(List<UtenteDto> utenti, CSVFormat csvFormat) {
		CSVUtil.ordinaListaUtentiDtoPerNomeAsc(utenti);
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (utenti == null || utenti.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}

			csvPrinter.printRecord(HEADERS);
			for (UtenteDto utente : utenti) {
				csvPrinter.printRecord(CSVUtil.getCSVRecord(utente));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new UtenteException("Errore export csv utenti", ex);
		}
	}

	private static void ordinaListaUtentiDtoPerNomeAsc(List<UtenteDto> enti) {
		enti.sort((utente1, utente2) -> utente1.getNome().compareTo(utente2.getNome()));
	}

	private static List<String> getCSVRecord(UtenteDto utente) {
		return Arrays.asList(utente.getId(), utente.getNome(), utente.getRuoli(), utente.getStato());
	}
}