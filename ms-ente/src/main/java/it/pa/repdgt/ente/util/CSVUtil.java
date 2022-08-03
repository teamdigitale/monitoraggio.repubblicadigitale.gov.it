package it.pa.repdgt.ente.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.ente.bean.EntePartnerUploadBean;
import it.pa.repdgt.ente.dto.EnteDto;
import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

public class CSVUtil {

	public static String TYPE = "text/csv";
	static String[] HEADERs = { "Nome", "Nome_Breve", "PIVA", "Sede_Legale" };

	private static final List<String> HEADERS = Arrays.asList(
			"ID",
			"NOME",
			"TIPOLOGIA ENTI",
			"PROFILI"
			);

	public static ByteArrayInputStream exportCSVEnti(List<EnteDto> enti, CSVFormat csvFormat) {
		CSVUtil.ordinaListaEntiDtoPerNomeAsc(enti);
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (enti == null || enti.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}

			csvPrinter.printRecord(HEADERS);
			for(EnteDto ente : enti) {
				csvPrinter.printRecord(CSVUtil.getCSVRecord(ente));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new EnteException("Errore export csv enti", ex, CodiceErroreEnum.EN01);
		}
	}

	private static void ordinaListaEntiDtoPerNomeAsc(List<EnteDto> enti) {
		enti.sort((ente1, ente2) -> ente1.getNome().compareTo(ente2.getNome()));
	}

	private static List<String> getCSVRecord(EnteDto ente) {
		return  Arrays.asList(
				ente.getId(),
				ente.getNome(),
				ente.getTipologia(),
				ente.getProfilo()
				);

	}



	public static boolean hasCSVFormat(MultipartFile file) {
		if (!TYPE.equals(file.getContentType())) {
			return false;
		}
		return true;
	}
	
	public static List<EntePartnerUploadBean> csvToEnti(InputStream is) {
		try (
				BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				CSVParser csvParser = new CSVParser(fileReader,
						CSVFormat.Builder.create().setHeader(HEADERs).setSkipHeaderRecord(true).setTrim(true).build());
			) {
			List<EntePartnerUploadBean> enti = new ArrayList<EntePartnerUploadBean>();
			Iterable<CSVRecord> csvRecords = csvParser.getRecords();
			for (CSVRecord csvRecord : csvRecords) {
				EntePartnerUploadBean ente = new EntePartnerUploadBean(
						csvRecord.get("Nome"),
						csvRecord.get("Nome_Breve"),
						csvRecord.get("PIVA"),
						csvRecord.get("Sede_Legale")
						);
				enti.add(ente);
			}
			return enti;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
		}
	}
}