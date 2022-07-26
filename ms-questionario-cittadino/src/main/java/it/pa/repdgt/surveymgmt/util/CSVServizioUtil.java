package it.pa.repdgt.surveymgmt.util;

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

import it.pa.repdgt.surveymgmt.bean.CittadinoUploadBean;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.resource.ServizioResource;

public class CSVServizioUtil {
	public static final String TYPE = "text/csv";

	private static final String NESSUN_RECORD_PRESENTE = "Nessun record presente";
	
	private static final String[] CITTADINO_UPLOAD_HEADERS = {
			"CodiceFiscale",
			"Nome",
			"Cognome",
			"TipoDocumento",
			"NumeroDocumento",
			"Genere",
			"AnnoNascita", 
			"TitoloStudio",
			"StatoOccupazionale", 
			"Cittadinanza",
			"ComuneDomicilio",
			"Email", 
			"Prefisso", 
			"NumeroCellulare", 
			"Telefono"
	};

	private static final List<String> HEADERS = Arrays.asList(
				"NOME",
				"FACILITATORE",
				"DATA",
				"STATO",
				"DURATA_SERVIZIO"
			);
	
	public static ByteArrayInputStream exportCSVServizi(final List<ServizioResource> servizi, final CSVFormat csvFormat) {
		CSVServizioUtil.ordinaListaProgrammiPerNomeAsc(servizi);
		
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (servizi == null || servizi.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList(NESSUN_RECORD_PRESENTE));
				csvPrinter.flush();
				return new ByteArrayInputStream(outputStream.toByteArray());
			}
			
			// Stampa riga intestatazione
			csvPrinter.printRecord(HEADERS);
			// Stampa dei record contenente i dati 
			for(ServizioResource servizio : servizi) {
				csvPrinter.printRecord(CSVServizioUtil.getCSVRecord(servizio));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new ServizioException("Errore export csv servizi", ex);
		}
	}

	private static void ordinaListaProgrammiPerNomeAsc(List<ServizioResource> servizi) {
		servizi.sort( (servizio1, servizio2) -> {
			return servizio1.getNomeServizio().compareTo( servizio2.getNomeServizio() );
		});
	}

	private static List<String> getCSVRecord(final ServizioResource servizioResource) {
		return  Arrays.asList(
							servizioResource.getNomeServizio(),
							servizioResource.getNominativoFacilitatore(),
							servizioResource.getDataServizio(),
							servizioResource.getStato(),
							servizioResource.getDurataServizio()
						);
	}
	
	public static boolean hasCSVFormat(MultipartFile file) {
		if (!TYPE.equals(file.getContentType())) {
			return false;
		}
		return true;
	}
	
	public static List<CittadinoUploadBean> csvToCittadini(InputStream is) {
		try (
				BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				CSVParser csvParser = new CSVParser(fileReader,
						CSVFormat.Builder.create().setHeader(CITTADINO_UPLOAD_HEADERS).setSkipHeaderRecord(true).setTrim(true).build());
			) {
			List<CittadinoUploadBean> cittadiniUploads = new ArrayList<>();
			Iterable<CSVRecord> csvRecords = csvParser.getRecords();
			for (CSVRecord csvRecord : csvRecords) {
				CittadinoUploadBean citadinoUpload = new CittadinoUploadBean(
						csvRecord.get("CodiceFiscale"),
						csvRecord.get("Nome"),
						csvRecord.get("Cognome"),
						csvRecord.get("TipoDocumento"),
						csvRecord.get("NumeroDocumento"),
						csvRecord.get("Genere"),
						csvRecord.get("AnnoNascita"), 
						csvRecord.get("TitoloStudio"),
						csvRecord.get("StatoOccupazionale"), 
						csvRecord.get("Cittadinanza"),
						csvRecord.get("ComuneDomicilio"), 
						csvRecord.get("ComuneDomicilio"),
						csvRecord.get("Email"), 
						csvRecord.get("Prefisso"), 
						csvRecord.get("NumeroCellulare"), 
						csvRecord.get("Telefono")
					);
				cittadiniUploads.add(citadinoUpload);
			}
			
			return cittadiniUploads;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
		}
	}
}