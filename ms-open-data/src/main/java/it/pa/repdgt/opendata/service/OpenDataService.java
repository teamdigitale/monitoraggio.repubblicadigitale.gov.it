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

import javax.transaction.Transactional;
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
import it.pa.repdgt.opendata.repository.CittadinoRepository;
import it.pa.repdgt.opendata.util.CSVUtil;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
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
	
	@Autowired
	private CittadinoRepository cittadinoRepository;
	
	private static final String patternDate = "dd_MM_yyyy";
	private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat(patternDate);
	final static String NOME_FILE = "opendata_cittadini.csv";
	
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
	//@Scheduled(cron = "0 0 0 1 */6 *")//job schedulato il giorno 1 del mese a mezzanotte ogni 6 mesi
	@Scheduled(cron = "0 0 13 * * *")//job schedulato ogni giorno alle 13 
	@LogMethod
	@LogExecutionTime
	public void caricaFileListaCittadiniSuAmazonS3() throws IOException {
		String nowDate = simpleDateFormat.format(new Date());
//		final String fileNameToUpload = "./fileCittadiniToUploadOn".concat(nowDate.toString().concat(".csv"));
		final String fileNameToUpload = "./".concat(NOME_FILE);
		
		final List<OpenDataCittadinoCSVBean> openDataCittadinoCSVBeanList = this.openDataCSVService.getAllOpenDataCittadino();
		ByteArrayInputStream byteArrayInputStream = CSVUtil.exportCSVOpenData(openDataCittadinoCSVBeanList, CSVFormat.EXCEL.builder().setDelimiter(";").build());
		
		int nBytes = byteArrayInputStream.available();
		byte[] bytes = new byte[nBytes];
		byteArrayInputStream.read(bytes, 0, nBytes);
		String datiToUpload = new String(bytes, StandardCharsets.UTF_8);
		File fileToUpload = null;
		try {
			log.info("Caricamento file {} in corso...", NOME_FILE);
			fileToUpload = this.creaFileToUpload(datiToUpload, fileNameToUpload);
			// upload file su AmazonS3
			this.s3Service.uploadFile(this.nomeDelBucketS3, fileToUpload);
			log.info("Caricamento file avvenuto con successo");
			Long dimensioneFileToUpload = fileToUpload.length();
			this.cancellaFile(fileToUpload);
			cittadinoRepository.azzeraCountDownloadAndAggiornaDimensioneFile(NOME_FILE, String.valueOf(dimensioneFileToUpload));
		} catch (Exception ex) {
			log.error("Errore caricamento file lista cittadini su AmazonS3 in data={}. ex={}", ex, nowDate);
		}finally {
			if(fileToUpload.exists()) 
				fileToUpload.delete();
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
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public byte[] scaricaFileListaCittadiniSuAmazonS3(final String fileToDownload) throws IOException{
		cittadinoRepository.updateCountDownload(fileToDownload, new Date());
		return this.s3Service.downloadFile(this.nomeDelBucketS3, fileToDownload).asByteArray();
	}
	
	@LogMethod
	@LogExecutionTime
	public Long getCountFile(final String fileToDownload) throws IOException{
		return cittadinoRepository.getCountDownload(fileToDownload);
	}
	
	@LogMethod
	@LogExecutionTime
	public String getPresignedUrl(final String fileToDownload) throws IOException{
		cittadinoRepository.updateCountDownload(fileToDownload, new Date());
		return this.s3Service.getPresignedUrl(fileToDownload, this.nomeDelBucketS3);
	}
	
	@LogMethod
	@LogExecutionTime
	public String getDimensioneFileOpenData(String nomeFile) {
		return cittadinoRepository.findDimensioneFileOpenData(nomeFile);
	}
}