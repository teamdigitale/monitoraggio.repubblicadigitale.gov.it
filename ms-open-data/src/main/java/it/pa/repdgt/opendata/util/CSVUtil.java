package it.pa.repdgt.opendata.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import it.pa.repdgt.opendata.bean.OpenDataCittadinoCSVBean;
import it.pa.repdgt.opendata.exception.OpenDataCSVExportException;
import it.pa.repdgt.opendata.projection.OpenDataCittadinoProjection;

public class CSVUtil {

	private static final List<String> HEADERS = Arrays.asList(
			"GENERE",
			"TITOLO_DI_STUDIO",
			"ANNO_DI_NASCITA",
			"OCCUPAZIONE",
			"REGIONE",
			"PROVINCIA",
			"COMUNE",
			"CAP",
			"SEDE_ID",
			"NOME_SEDE",
			"TIPOLOGIA_SERVIZIO",
			"SERVIZIO_ID",
			"NOME_SERVIZIO",
			"COMPETENZE_TRATTATE",
			"AMBITO_SERVIZI_PUBBLICI_DIGITALI",
			"POLICY"
		);

	public static ByteArrayInputStream exportCSVOpenData(List<OpenDataCittadinoCSVBean> openDataCittadinoCSVBeanList, CSVFormat csvFormat) {
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (openDataCittadinoCSVBeanList == null || openDataCittadinoCSVBeanList.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}

			csvPrinter.printRecord(HEADERS);
			for(OpenDataCittadinoCSVBean openDataCittadinoCSVBean : openDataCittadinoCSVBeanList) {
				csvPrinter.printRecord(CSVUtil.getCSVRecord(openDataCittadinoCSVBean.getOpenDataCittadinoProjection(), 
															openDataCittadinoCSVBean.getCompetenzeTrattate(),
															openDataCittadinoCSVBean.getAmbitoServizi()
															));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new OpenDataCSVExportException("Errore export openData cittadini", ex);
		}
	}

	private static List<String> getCSVRecord(OpenDataCittadinoProjection openDataCittadinoProjection, String competenzeTrattate, String ambitoServizi) {
		return  Arrays.asList(
				openDataCittadinoProjection.getGenere(),
				openDataCittadinoProjection.getTitoloDiStudio(),
				openDataCittadinoProjection.getAnnoDiNascita().toString(),
				openDataCittadinoProjection.getOccupazione(),
				openDataCittadinoProjection.getRegioneSede(),
				openDataCittadinoProjection.getProvinciaSede(),
				openDataCittadinoProjection.getComuneSede(),
				openDataCittadinoProjection.getCapSede(),
				openDataCittadinoProjection.getSedeId(),
				openDataCittadinoProjection.getNomeSede(),
				openDataCittadinoProjection.getTipologiaServizio(),
				openDataCittadinoProjection.getServizioId(),
				openDataCittadinoProjection.getNomeServizio(),
				competenzeTrattate,
				ambitoServizi,
				openDataCittadinoProjection.getPolicy()
			);
	}
}