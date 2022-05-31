package it.pa.repdgt.programmaprogetto.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import it.pa.repdgt.programmaprogetto.exception.ProgettoException;
import it.pa.repdgt.shared.entity.ProgettoEntity;

public class CSVProgettoUtil {

	private static final List<String> HEADERS = Arrays.asList(
				"ID",
				"NOME",
				"STATO"
			);
	
	public static ByteArrayInputStream exportCSVProgetti(List<ProgettoEntity> progetti, CSVFormat csvFormat) {
		CSVProgettoUtil.ordinaListaProgettiPerNomeAsc(progetti);
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (progetti == null || progetti.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}
			
			csvPrinter.printRecord(HEADERS);
			for(ProgettoEntity progetto : progetti) {
				csvPrinter.printRecord(CSVProgettoUtil.getCSVRecord(progetto));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new ProgettoException("Errore export csv enti", ex);
		}
	}

	private static void ordinaListaProgettiPerNomeAsc(List<ProgettoEntity> progetti) {
		progetti.sort((progetto1, progetto2) -> progetto1.getNome().compareTo(progetto2.getNome()));
	}

	private static List<String> getCSVRecord(ProgettoEntity progetto) {
		return  Arrays.asList(
							progetto.getId().toString(),
							progetto.getNome(),
							progetto.getStato()
						);
		
	}
}