package it.pa.repdgt.opendata.restapi;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.opendata.service.OpenDataService;

@RestController
@RequestMapping(path = "/open-data")
public class OpenDataRestApi {
	@Autowired
	private OpenDataService openDataService;
	final static String NOME_FILE = "opendata_cittadini.csv";
	
	@Deprecated
	@GetMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVCittadini() throws IOException {
		byte[] bytes = this.openDataService.scaricaFileListaCittadiniSuAmazonS3(NOME_FILE);
		InputStream is = new ByteArrayInputStream(bytes);
		InputStreamResource fileCSV = new InputStreamResource(is);
		

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=opendata-cittadini.csv")
				.contentType(MediaType.parseMediaType("application/csv")).body(fileCSV);
	}
	
	@GetMapping(path = "/count/download")
	public Map<String,String> getCountDownloadListaCSVCittadini() throws IOException {
		Map<String, String> resultMap = new HashMap<>();
		resultMap.put("conteggioDownload", String.valueOf(this.openDataService.getCountFile(NOME_FILE)));
		resultMap.put("dimensioneFile", String.valueOf(this.openDataService.getDimensioneFileOpenData(NOME_FILE)));
		return resultMap;
	}
	
	@GetMapping(path = "/presigned/download")
	public String getPresignedListaCSVCittadini() throws IOException {
		return this.openDataService.getPresignedUrl(NOME_FILE);
	}

	@GetMapping(path = "/carica-file/cittadini")
	public void caricaFileCittadini() throws IOException {
		this.openDataService.caricaFileListaCittadiniSuAmazonS3();
	}
}