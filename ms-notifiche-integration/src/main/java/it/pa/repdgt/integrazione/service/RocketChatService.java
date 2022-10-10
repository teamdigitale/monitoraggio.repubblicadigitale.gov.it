package it.pa.repdgt.integrazione.service;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.integrazione.exception.UtenteException;
import it.pa.repdgt.integrazione.repository.UtenteRepository;
import it.pa.repdgt.integrazione.request.RocketChatAutenticaORegistraRequest;
import it.pa.repdgt.integrazione.request.RocketChatCreaTokenRequest;
import it.pa.repdgt.integrazione.request.RocketChatCreaUtenteRequest;
import it.pa.repdgt.integrazione.request.RocketChatImpostaAvatarUtenteRequest;
import it.pa.repdgt.shared.entity.IntegrazioniUtenteEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RocketChatService {
	@Value("${rocket-chat.scheme:http://}")
	private String rocketChatScheme;
	@Value("${rocket-chat.host:}")
	private String rocketChatHost;
	@Value("${rocket-chat.baseUri:/api/v1}")
	private String baseUri;
	@Value("${rocket-chat.client.access-token:}")
	private String clientToken;
	@Value("${rocket-chat.client.user-id:}")
	private String clientUserId;
	
	private String rocketChatBaseUrl;
	private final static String CREA_UTENTE_ROCKET_CHAT_API = "/users.create";
	private final static String CREATE_TOKEN_ROCKET_CHAT_API = "/users.createToken";
	private final static String IMPOSTA_AVATAR_UTENTE_ROCKET_CHAT_API = "/users.setAvatar";

	@Autowired
	private UtenteRepository utenteRepository;
	@Autowired
	private RestTemplate restTemplate;

	@PostConstruct
	public void init() {
		this.rocketChatBaseUrl = new StringBuilder()
									.append(this.rocketChatScheme)
									.append(this.rocketChatHost)
									.append(this.baseUri)
									.toString();
		log.info("rocketChat - baseUrl {}", this.rocketChatBaseUrl);
	}
	
	@Transactional(rollbackOn = Exception.class)
	public Map<String, String> autenticaUtentePerIFrame(final Long idUtente, final RocketChatAutenticaORegistraRequest autenticaORegistraRequest) {
		final String messaggioErrore = String.format("Utente con id=%s non esiste", idUtente);
		// Recupero l'utente a aprtire dall'id se esiste, altrimenti eccezione
		UtenteEntity utenteDBFetch = this.utenteRepository.findById(idUtente)
				.orElseThrow(() -> new UtenteException(messaggioErrore));
		
		// Verifico se l'utente prelvato dal db è già stato precedentemente registrato su RocketChat
		final IntegrazioniUtenteEntity integrazioniUtente = utenteDBFetch.getIntegrazioneUtente();
		
		String idUtenteRocketChat = null;
		// Se l'utente prelavato a db non è registrato su RocketChat
		if(!integrazioniUtente.getUtenteRegistratoInRocketChat()) {
			// [1]. Creazione nuovo utente RocketChat
			RocketChatCreaUtenteRequest rocketChatUtenteRequest = new RocketChatCreaUtenteRequest();
			
			final String prefissoEmailUtente = utenteDBFetch.getEmail().split("@")[0];
			final String defaultUsername = prefissoEmailUtente.concat(idUtente.toString());
			rocketChatUtenteRequest.setUsername(autenticaORegistraRequest.getUsername() != null? autenticaORegistraRequest.getUsername(): defaultUsername);
			
			final String defaultName = utenteDBFetch.getNome();
			rocketChatUtenteRequest.setName(autenticaORegistraRequest.getName()!=null? autenticaORegistraRequest.getName(): defaultName);
			
			final String defaultEmail = utenteDBFetch.getEmail();
			rocketChatUtenteRequest.setEmail(autenticaORegistraRequest.getEmail()!=null?autenticaORegistraRequest.getEmail():  defaultEmail);
			
			rocketChatUtenteRequest.setPassword(UUID.randomUUID().toString().substring(0,12));
			
			ResponseEntity<Map> responseCreaUtenteRocketChat = null;
			try {
				responseCreaUtenteRocketChat = this.creaUtenteRocketChat(rocketChatUtenteRequest);
			} catch (Exception ex) {
				throw new RuntimeException(String.format("Errore creazione utente in RocketChat. %s", ex.getMessage()), ex);
			}
			
			if(responseCreaUtenteRocketChat.getStatusCode() != HttpStatus.OK) {
				throw new RuntimeException(String.format("Errore creazione utente in RocketChat. Api creaUtente ha resituito lo status-code=" + responseCreaUtenteRocketChat.getStatusCode()));
			}

			Map utenteRocketChatCreato = (Map) responseCreaUtenteRocketChat.getBody().get("user");
			idUtenteRocketChat = (String) utenteRocketChatCreato.get("_id");

			// TODO da cancellare
//			 2. Registrazione utente RocketChat
//			RocketChatResponse<RocketChatUtenteResource> responseRegistrazioneUtente = this.registraUtenteRockeChat(null);
//			if(responseRegistrazioneUtente.getSuccess()) {
//				throw new RuntimeException("Errore registrazione utente in RocketChat");
//			}
			
			// [2]. Salvo l'utente 
			utenteDBFetch.getIntegrazioneUtente().setUtenteRegistratoInRocketChat(Boolean.TRUE);
			utenteDBFetch.getIntegrazioneUtente().setIdUtenteRocketChat(idUtenteRocketChat);
			this.utenteRepository.save(utenteDBFetch);
			
			// TODO non serve al momento
			// [3]. Imposto avatar RocketChat
//			RocketChatImpostaAvatarUtenteRequest rocketChatImpostaAvatarUtenteRequest = new RocketChatImpostaAvatarUtenteRequest();
//			rocketChatImpostaAvatarUtenteRequest.setUserId(idUtenteRocketChat);
//			rocketChatImpostaAvatarUtenteRequest.setAvatarUrl(autenticaORegistraRequest.getAvatarUrlUtente());
//			ResponseEntity<Map> impostaAvatarUtenteResponse = null;
//			try {
//				impostaAvatarUtenteResponse = this.impostaAvatarUtenteRocketChat(rocketChatImpostaAvatarUtenteRequest);
//			} catch (Exception ex) {
//				throw new RuntimeException(String.format("Errore impostazione avatar utente in RocketChat. %s", ex.getMessage()), ex);
//			}
//			
//			if(impostaAvatarUtenteResponse.getStatusCode() != HttpStatus.OK) {
//				throw new RuntimeException("Errore impostazione avatar utente in RocketChat. Api setAvatar ha resituito lo status-code=" + responseCreaUtenteRocketChat.getStatusCode());
//			}
		} else {
			// Recupero id RocketChat salvato sulla tabella MySql  integrazioni_utente
			idUtenteRocketChat = utenteDBFetch.getIntegrazioneUtente().getIdUtenteRocketChat();
			if(idUtenteRocketChat == null) {
				throw new RuntimeException("Errore utente RocketChat inesistente");
			}
		}
		
		// [4]. Effettuo login su RocketChat che stacca il token e lo resituisco al chiamante
		RocketChatCreaTokenRequest rocketChatLoginRequest = new RocketChatCreaTokenRequest();
		rocketChatLoginRequest.setUserId(idUtenteRocketChat);
		Map<String, String> authTokenRocketChat= null;
		try {
			authTokenRocketChat = (Map<String, String>) this.creaTokenUtenteRocketChat(rocketChatLoginRequest).getBody().get("data");
		} catch (Exception ex) {
			throw new RuntimeException(String.format("Errore creazione token in RocketChat. %s", ex.getMessage()), ex);
		}
		return authTokenRocketChat;
	}

	/**
	 * crea token utente in RocketChat server
	 * 
	 * */
	private ResponseEntity<Map> creaTokenUtenteRocketChat(final RocketChatCreaTokenRequest rocketChatLoginRequest) {
		final String uri = rocketChatBaseUrl.concat(CREATE_TOKEN_ROCKET_CHAT_API);
		log.info("==> POST {}", uri);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
		headers.put("X-Auth-Token", Collections.singletonList(this.clientToken));
		headers.put("X-User-Id", Collections.singletonList(this.clientUserId));
		HttpEntity<RocketChatCreaTokenRequest> entity = new HttpEntity<>(rocketChatLoginRequest, headers);
		ResponseEntity<Map> response = this.restTemplate.exchange(uri, HttpMethod.POST, entity, Map.class);

		log.info("<== response status {}", response.getStatusCode());
		return response;
	}

	/**
	 * Creazione utente in RocketChat server
	 * 
	 * */
	private ResponseEntity<Map> creaUtenteRocketChat(final RocketChatCreaUtenteRequest rocketChatCreaUtenteRequest) {
		final String uri = rocketChatBaseUrl.concat(CREA_UTENTE_ROCKET_CHAT_API);
		log.info("==> POST {}", uri);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
		headers.put("X-Auth-Token", Collections.singletonList(this.clientToken));
		headers.put("X-User-Id", Collections.singletonList(this.clientUserId));
		HttpEntity<RocketChatCreaUtenteRequest> entity = new HttpEntity<>(rocketChatCreaUtenteRequest, headers);
		ResponseEntity<Map> response = this.restTemplate.exchange(uri, HttpMethod.POST, entity, Map.class);

		log.info("<== response status {}", response.getStatusCode());
		return response;
	}

	// TODO da cancellare
//	/**
//	 * Registrazione utente in RocketChat server
//	 * 
//	 * */
//	private RocketChatResponse<RocketChatUtenteResource> registraUtenteRockeChat(final RocketChatRegistraUtenteRequest rocketChatRegistraUtenteRequest) {
//		final String uri = rocketChatBaseUrl.concat(REGISTRA_UTENTE_ROCKET_CHAT_API);
//		log.info("==> POST {}", uri);
//		ResponseEntity<RocketChatResponse> response = this.restTemplate.postForEntity(uri, rocketChatRegistraUtenteRequest, RocketChatResponse.class);
//		log.info("<== response status {}", response.getStatusCode());
//		final RocketChatUtenteResource rocketChatUtenteResource = (RocketChatUtenteResource) response.getBody().getRocketChatResource();
//		return new RocketChatResponse<RocketChatUtenteResource>()
//				.entity(rocketChatUtenteResource)
//				.success(response.getStatusCode() == HttpStatus.OK? true: false);
//	}

	/**
	 * Impostazione avatar utente in RocketChat server
	 * 
	 * */
	private ResponseEntity<Map> impostaAvatarUtenteRocketChat(final RocketChatImpostaAvatarUtenteRequest rocketChatImpostaAvatarUtenteRequest) {
		final String uri = rocketChatBaseUrl.concat(IMPOSTA_AVATAR_UTENTE_ROCKET_CHAT_API);
		log.info("==> POST {}", uri);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
		headers.put("X-Auth-Token", Collections.singletonList(this.clientToken));
		headers.put("X-User-Id", Collections.singletonList(this.clientUserId));
		HttpEntity<RocketChatImpostaAvatarUtenteRequest> entity = new HttpEntity<>(rocketChatImpostaAvatarUtenteRequest, headers);
		ResponseEntity<Map> response = this.restTemplate.exchange(uri, HttpMethod.POST, entity, Map.class);
		
		log.info("<== response status {}", response.getStatusCode());
		return response;
	}
}