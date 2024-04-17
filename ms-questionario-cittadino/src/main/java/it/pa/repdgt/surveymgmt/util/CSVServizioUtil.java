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
import java.util.Iterator;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.bean.CittadinoUploadBean;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.resource.ServizioResource;

public class CSVServizioUtil {
	public static final String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

	private static final String NESSUN_RECORD_PRESENTE = "Nessun record presente";

	private static final String[] CITTADINO_UPLOAD_HEADERS = {
			"CodiceFiscale",
			"TipoDocumento",
			"NumeroDocumento",
			"Genere",
			"FasciDiEta",
			"TitoloStudio",
			"StatoOccupazionale",
			"Cittadinanza"
	};

	private static final List<String> HEADERS = Arrays.asList(
			"NOME",
			"FACILITATORE",
			"DATA",
			"STATO",
			"DURATA_SERVIZIO");

	private static final int N_CELL = 16;

	public static ByteArrayInputStream exportCSVServizi(final List<ServizioResource> servizi,
			final CSVFormat csvFormat) {
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
			for (ServizioResource servizio : servizi) {
				csvPrinter.printRecord(CSVServizioUtil.getCSVRecord(servizio));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new ServizioException("Errore export csv servizi", ex, CodiceErroreEnum.S02);
		}
	}

	private static void ordinaListaProgrammiPerNomeAsc(List<ServizioResource> servizi) {
		servizi.sort((servizio1, servizio2) -> {
			return servizio1.getNomeServizio().compareTo(servizio2.getNomeServizio());
		});
	}

	private static List<String> getCSVRecord(final ServizioResource servizioResource) {
		return Arrays.asList(
				servizioResource.getNomeServizio(),
				servizioResource.getNominativoFacilitatore(),
				servizioResource.getDataOraAggiornamento(),
				servizioResource.getStato(),
				servizioResource.getDurataServizio());
	}

	public static boolean hasExcelFormat(MultipartFile file) {
		if (!TYPE.equals(file.getContentType())) {
			return false;
		}
		return true;
	}

	@Deprecated
	public static List<CittadinoUploadBean> csvToCittadini(InputStream is) {
		try (
				BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				CSVParser csvParser = new CSVParser(fileReader,
						CSVFormat.Builder.create().setHeader(CITTADINO_UPLOAD_HEADERS).setSkipHeaderRecord(true)
								.setTrim(true).build());) {
			List<CittadinoUploadBean> cittadiniUploads = new ArrayList<>();
			Iterable<CSVRecord> csvRecords = csvParser.getRecords();
			for (CSVRecord csvRecord : csvRecords) {
				CittadinoUploadBean citadinoUpload = new CittadinoUploadBean(
						csvRecord.get("CodiceFiscale"),
						csvRecord.get("TipoDocumento"),
						csvRecord.get("NumeroDocumento"),
						csvRecord.get("Genere"),
						csvRecord.get("FasciaDiEtaId"),
						csvRecord.get("TitoloStudio"),
						csvRecord.get("StatoOccupazionale"),
						csvRecord.get("Cittadinanza"));
				cittadiniUploads.add(citadinoUpload);
			}

			return cittadiniUploads;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse CSV file: " + e.getMessage(), e);
		}
	}

	public static List<CittadinoUploadBean> excelToCittadini(InputStream is) {
		try (
				// Creo workbook instance che punta al file .xlsx
				XSSFWorkbook workbook = new XSSFWorkbook(is);) {
			List<CittadinoUploadBean> cittadiniUploads = new ArrayList<>();

			// Prendo il primo sheet dal workbook
			XSSFSheet sheet = workbook.getSheetAt(0);

			Iterator<Row> rowIterator = sheet.iterator();
			// Salto la riga dell'intesatazione
			if (rowIterator.hasNext()) {
				rowIterator.next();
			}

			// Itero su ogni riga dello sheet prelevato prima
			while (rowIterator.hasNext()) {
				final Row row = rowIterator.next();
				final CittadinoUploadBean cittadinoUpload = new CittadinoUploadBean();
				// nell'excel sono impostati dei drop down fino alla riga 100 che fanno leggere
				// quei record anche se vuoti
				// quindi quando trovo tutte le celle
				// uguali a null significa che non devo piu leggere ed esco
				if (isEmptyRow(row))
					break;
				for (int posCell = 0; posCell < N_CELL; posCell++) {
					final Cell cell = row.getCell(posCell);
					switch (posCell) {
						case 0: {
							cittadinoUpload.setCodiceFiscale(cell == null ? null : cell.getStringCellValue());
							break;
						}
						case 1: {
							cittadinoUpload.setTipoDocumento(cell == null ? null : cell.getStringCellValue());
							break;
						}
						case 2: {
							String numeroDocumento = null;
							if (cell != null) {
								try {
									numeroDocumento = cell.getStringCellValue();
								} catch (IllegalStateException ex) {
									numeroDocumento = String.valueOf((int) cell.getNumericCellValue());
								}
							}
							cittadinoUpload.setNumeroDocumento(numeroDocumento);
							break;
						}
						case 3: {
							cittadinoUpload.setGenere(cell == null ? null : cell.getStringCellValue());
							break;
						}
						case 4: {
							String fasciaDiEta = null;
							if (cell != null) {
								try {
									fasciaDiEta = String.valueOf((int) cell.getNumericCellValue());
								} catch (IllegalStateException ex) {
									fasciaDiEta = cell.getStringCellValue();
								}
							}
							cittadinoUpload.setFasciaDiEtaId(fasciaDiEta);
							break;
						}
						case 5: {
							cittadinoUpload.setTitoloStudio(cell == null ? null : cell.getStringCellValue());
							break;
						}
						case 6: {
							cittadinoUpload.setStatoOccupazionale(cell == null ? null : cell.getStringCellValue());
							break;
						}
						case 7: {
							cittadinoUpload.setCittadinanza(cell == null ? null : cell.getStringCellValue());
						}
					} // fine switch
				} // fine iterazione sulle celle della i-esima riga

				cittadiniUploads.add(cittadinoUpload);
			}

			return cittadiniUploads;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse Excel file: " + e.getMessage(), e);
		}
	}

	private static boolean isEmptyRow(Row row) {
		return row.getCell(0) == null
				&& row.getCell(1) == null
				&& row.getCell(2) == null
				&& row.getCell(3) == null
				&& row.getCell(4) == null
				&& row.getCell(5) == null
				&& row.getCell(6) == null
				&& row.getCell(7) == null;
	}
	// AGGIORNARE LE OBBLIGATORIETA' DEI CAMPI DEL CSV
}