package it.pa.repdgt.surveymgmt.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.dto.CittadinoDto;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;

@Service
public class CSVCittadiniUtil {
	private final List<String> HEADERS = Arrays.asList(
			"ID",
			"NUMERO SERVIZI",
			"NUMERO QUESTIONARI COMPILATI");

	public ByteArrayInputStream exportCSVCittadini(Page<CittadinoProjection> cittadini, CSVFormat csvFormat) {
		List<CittadinoDto> cittadiniDto = ordinaListaCittadiniPerIDAsc(cittadini);
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (cittadini == null || cittadini.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}

			csvPrinter.printRecord(HEADERS);
			for (CittadinoDto cittadino : cittadiniDto) {
				csvPrinter.printRecord(CSVCittadiniUtil.getCSVRecord(cittadino));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new CittadinoException("Errore export csv cittadini", ex, CodiceErroreEnum.CIT03);
		}
	}

	private  List<CittadinoDto>  ordinaListaCittadiniPerIDAsc(Page<CittadinoProjection> cittadiniProjection) {
		List<CittadinoDto> cittadiniDto = cittadiniProjection.stream().map(cittadino -> {
					CittadinoDto cittadinoDto = new CittadinoDto();
					cittadinoDto.setId(cittadino.getId());
					cittadinoDto.setDataUltimoAggiornamento(cittadino.getDataUltimoAggiornamento());
					cittadinoDto.setCodiceFiscale(cittadino.getCodiceFiscale());
					cittadinoDto.setNumeroServizi(cittadino.getNumeroServizi());
					cittadinoDto.setNumeroQuestionariCompilati(cittadino.getNumeroQuestionariCompilati() == null ? 0L
							: cittadino.getNumeroQuestionariCompilati());
					return cittadinoDto;
				}).collect(Collectors.toList());
		cittadiniDto.sort(Comparator.comparing(CittadinoDto::getId));
		return cittadiniDto;
	}

	private static List<String> getCSVRecord(CittadinoDto cittadino) {
		return Arrays.asList(
				cittadino.getId().toString(),
				cittadino.getNumeroServizi().toString(),
				cittadino.getNumeroQuestionariCompilati() == null ? "0"
						: cittadino.getNumeroQuestionariCompilati().toString());

	}
}
