package it.pa.repdgt.integrazione.restapi;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import it.pa.repdgt.integrazione.exception.DrupalException;
import it.pa.repdgt.integrazione.request.ForwardRichiestDrupalParam;
import it.pa.repdgt.integrazione.service.DrupalService;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@RestController
@RequestMapping(path = "drupal")
public class DrupalRestApi {
	private static final String COVER = "cover";

	private static final String ATTACHMENT = "attachment";

	private static final List<String> ALLOWED_FILE_TYPE = Arrays.asList(
		"TXT",  "RTF",  "ODT", "ZIP", "EXE", "DOCX", "DOC",
		"PPT",  "PPTX", "PDF", "JPG", "PNG", "GIF",  "XLS",
		"XLSX", "CSV",  "MPG", "WMV", "PDF", "JPEG"
	);
	
	private static final List<String> ALLOWED_FILE_TYPE_COVER = Arrays.asList(
		"PNG", "JPG", "JPEG"
	);
			
	@Autowired
	private DrupalService drupalService;
	
	@PostMapping(path = "/forward")
	@ResponseStatus(value = HttpStatus.OK)
	public Map<String, Object> drupalForward(@RequestBody final ForwardRichiestDrupalParam forwardRichiestDrupalParam, @RequestHeader(value = "Content-Type", required = false) String contentType) throws JsonMappingException, JsonProcessingException {
		final Boolean isUploadFile = forwardRichiestDrupalParam.getIsUploadFile() == null
										? Boolean.FALSE
										: forwardRichiestDrupalParam.getIsUploadFile();
		if(isUploadFile) {
			contentType = MediaType.MULTIPART_FORM_DATA_VALUE;
			
			final String fileNameToUpload = forwardRichiestDrupalParam.getFilenameToUpload();
			final String fileType = forwardRichiestDrupalParam.getType();
			if(fileNameToUpload == null || fileNameToUpload.trim().equals("") || fileType == null || fileType.trim().equals("") ) {
				throw new DrupalException("Nome file upload e type deve essere non null e non blank", CodiceErroreEnum.D01);
			}
			
			final String[] fileNameDotSplitted = fileNameToUpload.split("\\.");
			if(fileNameDotSplitted != null && fileNameDotSplitted.length > 2) {
				throw new DrupalException("Nome file upload deve avere solo una estensione", CodiceErroreEnum.D01);
			}
			
			if(fileNameDotSplitted.length > 0) {
				final String estensioneFileUpperCase = fileNameDotSplitted[fileNameDotSplitted.length-1].toUpperCase();
				
				if(fileType.equalsIgnoreCase(ATTACHMENT) && !ALLOWED_FILE_TYPE.contains(estensioneFileUpperCase)) {
					throw new DrupalException("Upload file '" + estensioneFileUpperCase + "' non consentito", CodiceErroreEnum.D01);
				} 
				if(fileType.equalsIgnoreCase(COVER) && !ALLOWED_FILE_TYPE_COVER.contains(estensioneFileUpperCase)) {
					throw new DrupalException("Upload file '" + estensioneFileUpperCase + "' non consentito", CodiceErroreEnum.D01);
				} 
			}
		} 
		return this.drupalService.forwardRichiestaADrupal(forwardRichiestDrupalParam, contentType);
	}
}