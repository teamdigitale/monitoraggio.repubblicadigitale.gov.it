package it.pa.repdgt.integrazione.restapi;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
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

import it.pa.repdgt.integrazione.request.ForwardRichiestDrupalParam;
import it.pa.repdgt.integrazione.service.DrupalService;
import it.pa.repdgt.shared.data.BasicFileData;
import it.pa.repdgt.shared.util.Utils;

@RestController
@RequestMapping(path = "drupal")
public class DrupalRestApi {
		
	@Autowired
	private DrupalService drupalService;
	
	@PostMapping(path = "/forward")
	@ResponseStatus(value = HttpStatus.OK)
	public Map<String, Object> drupalForward(@RequestBody final ForwardRichiestDrupalParam forwardRichiestDrupalParam, @RequestHeader(value = "Content-Type", required = false) String contentType) throws IOException {
		final Boolean isUploadFile = forwardRichiestDrupalParam.getIsUploadFile() == null
										? Boolean.FALSE
										: forwardRichiestDrupalParam.getIsUploadFile();
		BasicFileData fileSanificato = new BasicFileData();
		if(isUploadFile) {
			contentType = MediaType.MULTIPART_FORM_DATA_VALUE;
			
			byte[] filetoUpload = Base64.getDecoder().decode(forwardRichiestDrupalParam.getFileBase64ToUpload());
			String fileNamePrefix = forwardRichiestDrupalParam.getFilenameToUpload().split("\\.").length > 0 ? forwardRichiestDrupalParam.getFilenameToUpload().split("\\.")[0] : forwardRichiestDrupalParam.getFilenameToUpload();

			fileSanificato = Utils.processAndClean(filetoUpload, forwardRichiestDrupalParam.getFilenameToUpload(), null, Utils.DEFAULT_MAX_SIZE, Utils.ALL_ALLOWED_EXT,fileNamePrefix);
		} 

		return this.drupalService.forwardRichiestaADrupal(forwardRichiestDrupalParam, contentType, fileSanificato.getFile());
	}
}