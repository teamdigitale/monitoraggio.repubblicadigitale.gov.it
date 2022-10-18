package it.pa.repdgt.integrazione.restapi;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import it.pa.repdgt.integrazione.request.ForwardRichiestDrupalParam;
import it.pa.repdgt.integrazione.service.DrupalService;

@RestController
@RequestMapping(path = "drupal")
public class DrupalRestApi {
	@Autowired
	private DrupalService drupalService;
	
	@GetMapping(path = "/forward")
	@ResponseStatus(value = HttpStatus.OK)
	public Map<String, Object> drupalForward(@RequestParam(value = "file", required = true) final String filePath, @RequestHeader(value = "Content-Type", required = false) String contentType) {
		if(contentType == null) {
			contentType = MediaType.APPLICATION_JSON_VALUE.toString();
		}
		return this.drupalService.forwardRichiestaADrupal(filePath, contentType);
	}
	
	@PostMapping(path = "/forward")
	@ResponseStatus(value = HttpStatus.OK)
	public Map<String, Object> drupalForward(@RequestBody final ForwardRichiestDrupalParam forwardRichiestDrupalParam, @RequestHeader(value = "Content-Type", required = false) String contentType) throws JsonMappingException, JsonProcessingException {
		if(forwardRichiestDrupalParam.getIsUploadFile() != null && forwardRichiestDrupalParam.getIsUploadFile() == Boolean.TRUE) {
			contentType = MediaType.MULTIPART_FORM_DATA_VALUE;
		} 
		return this.drupalService.forwardRichiestaADrupal(forwardRichiestDrupalParam, contentType);
	}
}