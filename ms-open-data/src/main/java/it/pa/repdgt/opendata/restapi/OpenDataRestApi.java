package it.pa.repdgt.opendata.restapi;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.opendata.service.OpenDataService;

@RestController
@RequestMapping(path = "/open-data")
public class OpenDataRestApi {
	@Autowired
	private OpenDataService openDataService;
	final static String NOME_FILE = "fileCittadini.csv";
	
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVCittadini() throws IOException {
		byte[] bytes = this.openDataService.scaricaFileListaCittadiniSuAmazonS3(NOME_FILE);
		InputStream is = new ByteArrayInputStream(bytes);
		InputStreamResource fileCSV = new InputStreamResource(is);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=lista-cittadini.csv")
				.contentType(MediaType.parseMediaType("application/csv")).body(fileCSV);
	}
	
	@PostMapping(path = "/count/download")
	public Long getCountDownloadListaCSVCittadini() throws IOException {
		return this.openDataService.getCountFile(NOME_FILE);
	}
}