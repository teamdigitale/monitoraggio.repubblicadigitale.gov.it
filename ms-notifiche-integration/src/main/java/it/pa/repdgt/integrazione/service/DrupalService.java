package it.pa.repdgt.integrazione.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Base64;
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
	
	@Autowired
	private UtenteRepository utenteRepository;

	@Autowired
	private RestTemplate restTemplate;

	public Map forwardRichiestaADrupal(final @NotNull @Valid ForwardRichiestDrupalParam param, String contentType) {
		final String urlDaChiamare = drupalEndpoint.concat(param.getUrlRichiesta());
		final String metodoHttpString = param.getMetodoRichiestaHttp().toUpperCase();
		final HttpMethod metodoHttp = HttpMethod.resolve(metodoHttpString);
		FileOutputStream fostrm = null;
		Resource resource = null;
		File file = null;
		String nomeFile = null;

		ResponseEntity<Map> responseDrupal = null;
		try {
			final HttpHeaders forwardHeaders = this.getHeadersHttp(param, contentType);
			if(param.getIsUploadFile() != null && param.getIsUploadFile() == Boolean.TRUE) {
				// Decodifico file Base64
				byte[] bytesFileToUpload = Base64.getDecoder().decode(param.getFileBase64ToUpload());
				
				// Creazione file a partire dall'array di byte
				nomeFile = param.getFilenameToUpload() == null? "tmpFile": param.getFilenameToUpload();
				file = new File(nomeFile);
				fostrm = new FileOutputStream(file);
				fostrm.write(bytesFileToUpload);
				resource = new FileSystemResource(file);
				
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
		        	String rispostaDrupal = e.getMessage().contains(":")? e.getMessage().split(":")[1]: e.getMessage();
		        	String messaggioErrore = String.format("%s", rispostaDrupal);
		        	
					throw new DrupalException(messaggioErrore, e, CodiceErroreEnum.D01);
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
			String rispostaDrupal = ex.getMessage().contains(":")? ex.getMessage().split(":")[1]: ex.getMessage();
        	String messaggioErrore = String.format("%s", rispostaDrupal);
			throw new DrupalException(messaggioErrore, ex, CodiceErroreEnum.D01);
		} finally {
			// Cancellazione file creato in precedenza
			try {
				if(param.getIsUploadFile() != null && param.getIsUploadFile() == Boolean.TRUE) {
					fostrm.close();
					resource.getInputStream().close();
				}
			} catch (IOException e) {
				log.error("impossibile effettuare fileOutputStream.close --> {}", e);;
			}
			boolean isFileCancellato = file.delete();
			log.info("file '{}' cancellato?{}", nomeFile, isFileCancellato);
		}

		return responseDrupal.getBody();
	}
	
	private HttpHeaders getHeadersHttp(ForwardRichiestDrupalParam param, String contentType) {
		HttpHeaders headers = new HttpHeaders();
		String auth = this.drupalUsername + ":" + this.drupalPassword;
	 	String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(Charset.forName("UTF-8")));
		String authHeader = "Basic " + encodedAuth;
		headers.put("Authorization", Arrays.asList(authHeader));
		headers.put("Content-Type", Arrays.asList(contentType));
		
		
		Optional<UtenteEntity> utenteFetchDb = this.utenteRepository.findByCodiceFiscale(param.getCfUtenteLoggato());
		
		headers.put("user-id", Arrays.asList(utenteFetchDb.get().getId().toString()));
		headers.put("user-roles", Arrays.asList(param.getCodiceRuoloUtenteLoggato()));
		return headers;
	}
}