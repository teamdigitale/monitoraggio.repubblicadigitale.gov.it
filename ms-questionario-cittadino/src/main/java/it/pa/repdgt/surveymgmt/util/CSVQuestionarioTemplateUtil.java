package it.pa.repdgt.surveymgmt.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.resource.QuestionarioTemplateLightResource;

public class CSVQuestionarioTemplateUtil {
	public static final String TYPE = "text/csv";

	private static final String NESSUN_RECORD_PRESENTE = "Nessun record presente";

	private static final List<String> HEADERS = Arrays.asList(
				"NOME",
				"DESCRIZIONE",
				"STATO"
			);

	public static ByteArrayInputStream exportCSVQuestionariTemplate(final List<QuestionarioTemplateLightResource> questionariTemplate, final CSVFormat csvFormat) {
		CSVQuestionarioTemplateUtil.ordinaListaQuestionariTemplatePerNomeAsc(questionariTemplate);
		
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (questionariTemplate == null || questionariTemplate.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList(NESSUN_RECORD_PRESENTE));
				csvPrinter.flush();
				return new ByteArrayInputStream(outputStream.toByteArray());
			}
			
			// Stampa riga intestatazione
			csvPrinter.printRecord(HEADERS);
			// Stampa dei record contenente i dati 
			for(QuestionarioTemplateLightResource questionarioTemplate : questionariTemplate) {
				csvPrinter.printRecord(CSVQuestionarioTemplateUtil.getCSVRecord(questionarioTemplate));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new ServizioException("Errore export csv questionariTemplate", ex);
		}
	}

	private static void ordinaListaQuestionariTemplatePerNomeAsc(List<QuestionarioTemplateLightResource> questionariTemplate) {
		questionariTemplate.sort( (questionarioTemplate1, questionarioTemplate2) -> {
			return questionarioTemplate1.getNomeQuestionarioTemplate().compareTo( questionarioTemplate2.getNomeQuestionarioTemplate() );
		});
	}

	private static List<String> getCSVRecord(final QuestionarioTemplateLightResource questionarioTemplateLightResource) {
		return  Arrays.asList(
						questionarioTemplateLightResource.getNomeQuestionarioTemplate(),
						questionarioTemplateLightResource.getDescrizione(),
						questionarioTemplateLightResource.getStatoQuestionarioTemplate()
						);
	}
}
