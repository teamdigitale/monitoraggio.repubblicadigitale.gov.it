package it.pa.repdgt.integrazione.service;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.integrazione.exception.DrupalException;
import it.pa.repdgt.integrazione.repository.UtenteRepository;
import it.pa.repdgt.integrazione.request.ForwardRichiestDrupalParam;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.extern.slf4j.Slf4j;

@Service
@Validated
@Slf4j
public class DrupalService {
	@Value("${drupal.endpoint:}")
	private String drupalEndpoint;
	@Value("${drupal.auth.username:}")
	private String drupalUsername;
	@Value("${drupal.auth.password:}")
	private String drupalPassword;
	@Value("${drupal.s3.bucket-name:}")
	private String nomeBucketS3Drupal;

	@Autowired
	private S3Service s3Service;
	@Autowired
	private UtenteRepository utenteRepository;
	
	@Autowired
	private RestTemplate restTemplate;

	public Map forwardRichiestaADrupal(final @NotNull @Valid ForwardRichiestDrupalParam param, String contentType) {
		final String urlDaChiamare = drupalEndpoint.concat(param.getUrlRichiesta());
		final String metodoHttpString = param.getMetodoRichiestaHttp().toUpperCase();
		final HttpMethod metodoHttp = HttpMethod.resolve(metodoHttpString);

		ResponseEntity<Map> responseDrupal = null;
		try {
			final HttpHeaders forwardHeaders = this.getHeadersHttp(param, contentType);
			if(param.getIsUploadFile() != null && param.getIsUploadFile() == Boolean.TRUE) {
				// Decodifico file Base64
//				byte[] bytesFileToUpload = Base64.getMimeDecoder().decode(param.getFileBase64ToUpload().trim());
				byte[] bytesFileToUpload = org.apache.commons.codec.binary.Base64.decodeBase64(param.getFileBase64ToUpload());
				// Creazione file a partire dall'array di byte
				final String nomeFile = param.getFilenameToUpload() == null? "tmpFile": param.getFilenameToUpload();
				File file = new File(nomeFile);
				FileOutputStream fostrm = new FileOutputStream(file);
				fostrm.write(bytesFileToUpload);
				Resource resource = new FileSystemResource(file);
				
				// Creazione multipart
				MultipartBodyBuilder multipartBodyBuilder = new MultipartBodyBuilder();
				multipartBodyBuilder.part("data",     resource);
				multipartBodyBuilder.part("url",      param.getUrlRichiesta());
				multipartBodyBuilder.part("type",     param.getType());
		        MultiValueMap<String, HttpEntity<?>> multipartBody = multipartBodyBuilder.build();
		        HttpEntity<MultiValueMap<String, HttpEntity<?>>> requestEntity = new HttpEntity<>(multipartBody, forwardHeaders);
			 
		        
		        log.info("Richiesta Servizio Drupal: {} {} headersRichiesta={} corpoRichiesta={}", 
						metodoHttp, urlDaChiamare, forwardHeaders, requestEntity);
		        log.info("Caricamento file '{}' in corso...", nomeFile);
		        try {
		        	responseDrupal = this.restTemplate.exchange(urlDaChiamare, metodoHttp, requestEntity, Map.class);
		        } catch (Exception e) {
		        	String messaggioErrore = String.format("Errore chiamata REST DRUPAL: %s %s - datail: %s", metodoHttp, urlDaChiamare, e.getMessage());
					throw new DrupalException(messaggioErrore, e, CodiceErroreEnum.D01);
				} finally {
					// Cancellazione file creato in precedenza
					fostrm.close();
					resource.getInputStream().close();
					boolean isFileCancellato = file.delete();
					log.info("file '{}' cancellato?{}", nomeFile, isFileCancellato);
				}
			} else {
				String forwardBody = param.getBodyRichiestaHttp();
				
				// Richiesta Http da inviare a Drupal
				HttpEntity<String> forwardRequestEntity = new HttpEntity<String>(forwardBody, forwardHeaders);
				
				log.info("Richiesta Servizio Drupal: {} {} headersRichiesta={} corpoRichiesta={}", 
						metodoHttp, urlDaChiamare, forwardHeaders, forwardBody);
				responseDrupal = this.restTemplate.exchange(urlDaChiamare, metodoHttp, forwardRequestEntity, Map.class);
			}
		
		} catch (Exception ex) {
			String messaggioErrore = String.format("Errore chiamata servizio DRUPAL: %s %s - detail: %s", metodoHttp, urlDaChiamare, ex.getMessage());
			throw new DrupalException(messaggioErrore, ex, CodiceErroreEnum.D01);
		}

		return responseDrupal.getBody();
	}
	
	private HttpHeaders getHeadersHttp(ForwardRichiestDrupalParam param, String contentType) {
		HttpHeaders headers = new HttpHeaders();
		String auth = this.drupalUsername + ":" + this.drupalPassword;
	 	String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(Charset.forName("UTF-8")));
		String authHeader = "Basic " + encodedAuth;
		headers.put("Authorization", Arrays.asList(authHeader));
		headers.put("Content-Type",  Arrays.asList(contentType));
		
		
		Optional<UtenteEntity> utenteFetchDb = this.utenteRepository.findByCodiceFiscale(param.getCfUtenteLoggato());
		
		headers.put("user-id", Arrays.asList(utenteFetchDb.get().getId().toString()));
		headers.put("user-roles", Arrays.asList(param.getCodiceRuoloUtenteLoggato()));
		return headers;
	}

	public Map<String, String> forwardRichiestaADrupal(final String filePath, final String contentType) {
		if(!this.drupalEndpoint.endsWith("/") && !filePath.startsWith("/")) {
			this.drupalEndpoint = this.drupalEndpoint.concat("/");
		}
		final String urlDaChiamare = this.drupalEndpoint.concat(filePath);
		final HttpMethod metodoHttp = HttpMethod.GET;
		
		final Map<String, String> response = new HashMap<>();
		ResponseEntity<String> responseDrupal = null;
		try {
			HttpHeaders forwardHeaders = new HttpHeaders();
			String auth = this.drupalUsername + ":" + this.drupalPassword;
//		 	String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(Charset.forName("UTF-8")));
//			String authHeader = "Basic " + encodedAuth;
//			forwardHeaders.put("Authorization", Arrays.asList(authHeader));
			forwardHeaders.put("Content-Type",  Arrays.asList(contentType));
			
			// Richiesta Http da inviare a Drupal
			HttpEntity<String> forwardRequestEntity = new HttpEntity<String>(null, forwardHeaders);
			log.info("Richiesta Servizio Drupal: {} {} headersRichiesta={}", metodoHttp, urlDaChiamare, forwardHeaders);
			responseDrupal = this.restTemplate.exchange(urlDaChiamare, metodoHttp, forwardRequestEntity, String.class);
			final String nomeFileS3Drupal = responseDrupal.getBody();
			//final String presgnedUrlDrupal = this.s3Service.getPresignedUrlDrupal(nomeFileS3Drupal, this.nomeBucketS3Drupal);
			//response.put("presignedUrlDrupal", presgnedUrlDrupal);
			
		} catch (Exception e) {
        	String messaggioErrore = String.format("Errore chiamata REST DRUPAL: %s %s - datail: %s", metodoHttp, urlDaChiamare, e.getMessage());
			throw new DrupalException(messaggioErrore, e, CodiceErroreEnum.D01);
		}
		
		return response;
	}
}