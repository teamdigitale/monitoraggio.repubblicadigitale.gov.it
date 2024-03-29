package it.pa.repdgt.integrazione.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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
import org.springframework.web.util.UriComponentsBuilder;

import it.pa.repdgt.integrazione.exception.DrupalException;
import it.pa.repdgt.integrazione.repository.GruppoRepository;
import it.pa.repdgt.integrazione.repository.ProgrammaRepository;
import it.pa.repdgt.integrazione.repository.UtenteRepository;
import it.pa.repdgt.integrazione.request.ForwardRichiestDrupalParam;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
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
	private ProgrammaRepository programmaRepository;
	@Autowired
	private UtenteRepository utenteRepository;
	@Autowired 
	private GruppoRepository gruppoRepository;
	@Autowired
	private RestTemplate restTemplate;
	
	public static final List<String> ENDPOINT_RUOLI = Arrays.asList(
			"^/api/board/items$",
			"^/api/board/item/[A-Za-z0-9]+/user/[A-Za-z0-9]+$",
			"^/api/search/board/items$",
			"^/api/document/items$",
			"^/api/document/item/[A-Za-z0-9]+/user/[A-Za-z0-9]+$",
			"^/api/search/document/items$",
			"^/api/board/filters$",
			"^/api/document/filters$"
	);

	public Map forwardRichiestaADrupal(final @NotNull @Valid ForwardRichiestDrupalParam param, String contentType) {
		String urlDaChiamare = drupalEndpoint.concat(param.getUrlRichiesta());
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
				byte[] bytesFileToUpload = null;
				try {
					// Decodifico file Base64
					bytesFileToUpload = Base64.getDecoder().decode(param.getFileBase64ToUpload());
				} catch (Exception ex) {
					throw new DrupalException("Errore decodifica file base64. " + ex.getMessage(), ex, CodiceErroreEnum.G01);
				}
				
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
		        } catch (Exception ex) {
		        	String errorMessageDrupal = ex.getMessage().contains(":")? ex.getMessage().replaceFirst(":", "_REQ_DRUPAL_"): ex.getMessage();
					String rispostaDrupal = errorMessageDrupal.contains("_REQ_DRUPAL_")? errorMessageDrupal.split("_REQ_DRUPAL_")[1]: errorMessageDrupal;
		        	String messaggioErrore = String.format("%s", rispostaDrupal);
		        	
					throw new DrupalException(messaggioErrore, ex, CodiceErroreEnum.D01);
				}
			} else {
				String forwardBody = param.getBodyRichiestaHttp();
				
				// Richiesta Http da inviare a Drupal
				HttpEntity<String> forwardRequestEntity = new HttpEntity<String>(forwardBody, forwardHeaders);
				
				log.info("Richiesta Servizio Drupal: {} {} headersRichiesta={} corpoRichiesta={}", 
						metodoHttp, urlDaChiamare, forwardHeaders, forwardBody);
				 try {
					 if("GET".equals(metodoHttpString) && endpointMatcher(param.getUrlRichiesta().split("\\?")[0], ENDPOINT_RUOLI))	
						 urlDaChiamare = this.transformUrl(param, urlDaChiamare);
					 responseDrupal = this.restTemplate.exchange(urlDaChiamare, metodoHttp, forwardRequestEntity, Map.class);
				  } catch (Exception ex) {
		        	String errorMessageDrupal = ex.getMessage().contains(":")? ex.getMessage().replaceFirst(":", "_REQ_DRUPAL_"): ex.getMessage();
					String rispostaDrupal = errorMessageDrupal.contains("_REQ_DRUPAL_")? errorMessageDrupal.split("_REQ_DRUPAL_")[1]: errorMessageDrupal;
		        	String messaggioErrore = String.format("%s", rispostaDrupal);
		        	
					throw new DrupalException(messaggioErrore, ex, CodiceErroreEnum.D01);
				}
			}
		} catch (Exception ex) {
			throw new DrupalException(ex.getMessage(), ex, CodiceErroreEnum.D01);
		} finally {
			// Cancellazione file creato in precedenza
			if(param.getIsUploadFile() != null && param.getIsUploadFile() == Boolean.TRUE) {
				try {
						fostrm.close();
						resource.getInputStream().close();
				} catch (IOException e) {
					log.error("impossibile effettuare fileOutputStream.close --> {}", e);;
				}
				boolean isFileCancellato = file.delete();
				log.info("file '{}' cancellato? {}", nomeFile, isFileCancellato);
			}
		}

		return responseDrupal.getBody();
	}
	
	private String transformUrl(ForwardRichiestDrupalParam param, String url) {
		String programInterventionValue = "public-public+";
		
		switch(param.getCodiceRuoloUtenteLoggato()) {
			case "DSCU": {
				 final StringBuilder stringBuilder = new StringBuilder();
				 this.programmaRepository.findByPolicy(PolicyEnum.SCD)
				 						 .stream()
										 .map(prog -> prog.getId().toString().concat("-").concat(prog.getPolicy().toString()).concat("+"))
										 .forEach(progIntervention -> stringBuilder.append(progIntervention));
				String programmiIntervention = stringBuilder.length() > 0 ? 
						stringBuilder.toString().substring(0, stringBuilder.length()-1) :
							"";

				programInterventionValue = programInterventionValue.concat("public-SCD+").concat(programmiIntervention);
				break;
			}
			case "REG": 
			case "DEG": 
			case "DEPP": 
			case "REGP": 
			case "REPP": 
			case "DEGP": 
			case "FAC": 
			case "VOL": 
			{
					ProgrammaEntity programma = this.programmaRepository.findById(param.getProfilo().getIdProgramma()).get();
					programInterventionValue = programInterventionValue.concat("public-" + programma.getPolicy().toString()).concat("+" + programma.getId() + "-" + programma.getPolicy().toString());
											
				break;
			}
			default: {
				 final StringBuilder stringBuilder = new StringBuilder();
				 this.programmaRepository.findAll()
				 						 .stream()
										 .map(prog -> prog.getId().toString().concat("-").concat(prog.getPolicy().toString()).concat("+"))
										 .forEach(progIntervention -> stringBuilder.append(progIntervention));
				String programmiIntervention = stringBuilder.toString().substring(0, stringBuilder.length()-1);

				programInterventionValue = programInterventionValue.concat("public-RFD+").concat("public-SCD+").concat(programmiIntervention);
			}
		}
		
	    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("program_intervention", programInterventionValue );

         return uriBuilder.toUriString();
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
		
		final StringBuilder codiceGruppiByCodiceRuolo = new StringBuilder().append("");
			
		this.gruppoRepository
			.findCodiciGruppoByCodiceRuolo(param.getCodiceRuoloUtenteLoggato())
			.stream()
			.map(codiceGruppo -> codiceGruppo.concat(";"))
			.forEach(codiceGruppo -> codiceGruppiByCodiceRuolo.append(codiceGruppo));
		
		headers.put("user-roles", Arrays.asList(param.getCodiceRuoloUtenteLoggato()));
		headers.put("role-groups", Arrays.asList( codiceGruppiByCodiceRuolo.toString() ) );
		return headers;
	}
	
	private static boolean endpointMatcher(String endpointToMatch, List<String> listMatch) {
		for(String endpointNonChecked: listMatch) {
			Pattern pattern = Pattern.compile(endpointNonChecked);
		    Matcher matcher = pattern.matcher(endpointToMatch);
			if(matcher.find())
				return true;
		}
		return false;
	}

}