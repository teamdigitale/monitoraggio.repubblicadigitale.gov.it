package it.pa.repdgt.programmaprogetto.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import it.pa.repdgt.programmaprogetto.exception.EnteException;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

public class CSVProgrammaUtil {

	private static final List<String> HEADERS = Arrays.asList(
				"CODICE",
				"NOME",
				"POLICY",
				"STATO"
			);
	
	public static ByteArrayInputStream exportCSVProgrammi(List<ProgrammaEntity> programmi, CSVFormat csvFormat) {
		CSVProgrammaUtil.ordinaListaProgrammiPerNomeAsc(programmi);
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (programmi == null || programmi.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}
			
			csvPrinter.printRecord(HEADERS);
			for(ProgrammaEntity programma : programmi) {
				csvPrinter.printRecord(CSVProgrammaUtil.getCSVRecord(programma));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new EnteException("Errore export csv enti", ex);
		}
	}

	private static void ordinaListaProgrammiPerNomeAsc(List<ProgrammaEntity> programmi) {
		programmi.sort((programma1, programma2) -> programma1.getNome().compareTo(programma2.getNome()));
	}

	private static List<String> getCSVRecord(ProgrammaEntity programma) {
		return  Arrays.asList(
							programma.getCodice(),
							programma.getNome(),
							programma.getPolicy().toString(),
							programma.getStato()
						);
		
	}
}