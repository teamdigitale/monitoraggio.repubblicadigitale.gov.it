package it.pa.repdgt.opendata.service;

import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.apache.commons.csv.CSVFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.opendata.bean.OpenDataCittadinoCSVBean;
import it.pa.repdgt.opendata.util.CSVUtil;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Scope("singleton")
@Validated
@Slf4j
public class OpenDataService {
	@Autowired
	private S3Service s3Service;
	@Value("${AWS.S3.BUCKET-NAME:}")
	private String nomeDelBucketS3;
	
	private static final String patternDate = "dd_MM_yyyy";
	private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat(patternDate);
	
	@Autowired
	private OpenDataCSVService openDataCSVService;

//					   ┌───────────── second (0-59)
//					   │ ┌───────────── minute (0 - 59)
//					   │ │ ┌───────────── hour (0 - 23)
//					   │ │ │ ┌───────────── day of the month (1 - 31)
//					   │ │ │ │  ┌───────────── month (1 - 12) (or JAN-DEC)
//					   │ │ │ │  │ ┌───────────── day of the week (0 - 7)
//					   │ │ │ │  │ │              (or MON-SUN -- 0 or 7 is Sunday)
//					   │ │ │ │  │ │
//					   * * * *  * *
	@Scheduled(cron = "0 0 6 * * *")
	public void caricaFileListaCittadiniSuAmazonS3() throws IOException {
		String nowDate = simpleDateFormat.format(new Date());
//		final String fileNameToUpload = "./fileCittadiniToUploadOn".concat(nowDate.toString().concat(".csv"));
		final String fileNameToUpload = "./fileCittadini".concat(".csv");
		
		final List<OpenDataCittadinoCSVBean> openDataCittadinoCSVBeanList = this.openDataCSVService.getAllOpenDataCittadino();
		ByteArrayInputStream byteArrayInputStream = CSVUtil.exportCSVOpenData(openDataCittadinoCSVBeanList, CSVFormat.EXCEL.builder().setDelimiter(";").build());
		
		int nBytes = byteArrayInputStream.available();
		byte[] bytes = new byte[nBytes];
		byteArrayInputStream.read(bytes, 0, nBytes);
		String datiToUpload = new String(bytes, StandardCharsets.UTF_8);
		
		try {
			final File fileToUpload = this.creaFileToUpload(datiToUpload, fileNameToUpload);
			// upload file su AmazonS3
			this.s3Service.uploadFile(this.nomeDelBucketS3, fileToUpload);
			this.cancellaFile(fileToUpload);
		} catch (Exception ex) {
			log.error("Errore caricamento file lista cittadini su AmazonS3 in data={}. ex={}", ex, nowDate);
		} 
	}
	
	public File creaFileToUpload(@NotNull final String dati, @NotBlank final String fileName) throws IOException {
		final File fileToUpload = new File(fileName);
		
		FileWriter fileWriter = null;
		BufferedWriter bufferedWriter = null;
		try {
			fileToUpload.createNewFile();
			fileWriter = new FileWriter(fileToUpload);
			bufferedWriter = new BufferedWriter(fileWriter);
			bufferedWriter.write(dati);
		} catch (Exception ex) {
			log.error("Errore creazione del file contenetente la lista cittadini. ex={}", ex);
		} finally {
			if(bufferedWriter != null) {
				bufferedWriter.close();
			}
			if(fileWriter != null) {
				fileWriter.close();
			}
		}
		return fileToUpload;
	}
	
	public boolean cancellaFile(final File file) throws FileNotFoundException {
		if(!file.exists()) {
			throw new FileNotFoundException(String.format("file %s non esiste", file.getName()));
		}
		return file.delete();
	}
	
	public byte[] scaricaFileListaCittadiniSuAmazonS3(final String fileToDownload) throws IOException{
		return this.s3Service.downloadFile(this.nomeDelBucketS3, fileToDownload).asByteArray();
	}
}