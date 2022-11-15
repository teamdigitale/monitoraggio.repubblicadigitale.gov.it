package it.pa.repdgt.opendata.restapi;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.opendata.bean.OpenDataDetailsBean;
import it.pa.repdgt.opendata.service.OpenDataService;

@RestController
@RequestMapping(path = "/open-data")
public class OpenDataRestApi {
	@Autowired
	private OpenDataService openDataService;
	final static String NOME_FILE = "opendata_cittadini.csv";
	
	@GetMapping(path = "/count/download")
	public OpenDataDetailsBean getCountDownloadListaCSVCittadini() throws IOException {
		return this.openDataService.getDetails(NOME_FILE);
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