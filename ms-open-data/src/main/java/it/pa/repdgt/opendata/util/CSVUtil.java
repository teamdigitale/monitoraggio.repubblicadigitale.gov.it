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
			"ID",
			"ANNO_DI_NASCITA",
			"GENERE",
			"OCCUPAZIONE",
			"TITOLO_DI_STUDIO",
			"SERVIZIO_ID",
			"NOME_SERVIZIO",
			"DATA_FRUIZIONE_SERVIZIO",
			"AMBITO_SERVIZI_PUBBLICI_DIGITALI",
			"TIPOLOGIA_SERVIZIO",
			"COMPETENZE_TRATTATE",
			"SEDE_ID",
			"NOME_SEDE",
			"REGIONE",
			"PROVINCIA",
			"COMUNE",
			"CAP",
			"INTERVENTO",			
			"ID_PROGRAMMA",			
			"ID_PROGETTO"
		);

	public static ByteArrayInputStream exportCSVOpenData(List<OpenDataCittadinoCSVBean> openDataCittadinoCSVBeanList, CSVFormat csvFormat) {
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (openDataCittadinoCSVBeanList == null || openDataCittadinoCSVBeanList.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}

			csvPrinter.printRecord(HEADERS);
			int indiceRiga = 1;
			for(OpenDataCittadinoCSVBean openDataCittadinoCSVBean : openDataCittadinoCSVBeanList) {
				csvPrinter.printRecord(CSVUtil.getCSVRecord(String.valueOf(indiceRiga),
															openDataCittadinoCSVBean.getOpenDataCittadinoProjection(), 
															openDataCittadinoCSVBean.getCompetenzeTrattate(),
															openDataCittadinoCSVBean.getAmbitoServizi()
															));
				indiceRiga++;
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new OpenDataCSVExportException("Errore export openData cittadini", ex);
		}
	}

	private static List<String> getCSVRecord(String indiceRiga, OpenDataCittadinoProjection openDataCittadinoProjection, String competenzeTrattate, String ambitoServizi) {
		return  Arrays.asList(
				indiceRiga,
				openDataCittadinoProjection.getAnnoDiNascita().toString(),
				openDataCittadinoProjection.getGenere(),
				openDataCittadinoProjection.getOccupazione(),
				openDataCittadinoProjection.getTitoloDiStudio(),
				openDataCittadinoProjection.getServizioId(),
				openDataCittadinoProjection.getNomeServizio(),
				openDataCittadinoProjection.getDataFruizioneServizio(),//data servizio in servizio
				ambitoServizi,
				openDataCittadinoProjection.getTipologiaServizio(),
				competenzeTrattate,
				openDataCittadinoProjection.getSedeId(),
				openDataCittadinoProjection.getNomeSede(),
				openDataCittadinoProjection.getRegioneSede(),
				openDataCittadinoProjection.getProvinciaSede(),
				openDataCittadinoProjection.getComuneSede(),
				openDataCittadinoProjection.getCapSede(),
				openDataCittadinoProjection.getPolicy(),
				openDataCittadinoProjection.getIdProgramma(),
				openDataCittadinoProjection.getIdProgetto()
				//gestione arco temporale (inserire in tabella data ultimo caricamente + restituire nel servizio di
				// count download la lista degli anni da prima pubblicazione a ultima)
			);
	}
}