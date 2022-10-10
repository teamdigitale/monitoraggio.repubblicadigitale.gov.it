package it.pa.repdgt.shared;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Base64;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.ReadListener;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.Part;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RequestWrapper extends HttpServletRequestWrapper {
	

	private ObjectMapper objectMapper = new ObjectMapper();
	private String body;
	private String codiceFiscale;
	private String codiceRuolo;

	public RequestWrapper(final HttpServletRequest httpServletRequest) throws Exception {
		super(httpServletRequest);

		// to fix h2 in memory db
		httpServletRequest.getParameterNames();

		Map<String, String> headers = this.getRequestHeaders(httpServletRequest);
		Optional<String> authToken = Optional.ofNullable(headers.get(FilterUtil.AUTH_TOKEN_HEADER));
		Optional<String> codiceRuolo = Optional.ofNullable(headers.get(FilterUtil.USER_ROLE_HEADER));

		String endpoint = httpServletRequest.getServletPath();
		String metodoHttp = httpServletRequest.getMethod();

		log.debug("Filter - ENDPOINT - {}", endpoint);
		log.debug("Filter - METHOD - {}", metodoHttp);

		/****** DECODE TOKEN ********/
		/*se non esiste codiceRuolo e/o authToken API GATEWAY blocca la chiamata 
		 * split del JWT nelle sue 3 parti con il delimitatore '.' 
		 * (part 1 = HEADER, part 2 = PAYLOAD, part 3 = SIGNATURE (Algorith (header + payload), secretKey)
		 */
		if(authToken.isPresent()) {
			String[] parts = authToken.get().split("\\.");
			//if in caso di api senza token (token = stringa vuota) --> API questionario ANONIMO
			if(parts.length > 1) {
				//recupero la parte jwt del payload e la decodifico da Base64 
				String jwtPayload = decode(parts[1]);

				JsonNode jsonNodeRoot = objectMapper.readTree(jwtPayload);
				//recupero il codiceFiscale dal payload
				JsonNode jsonCodiceFiscale = jsonNodeRoot.get("custom:fiscalNumber");
				String[] codFiscTinit = jsonCodiceFiscale.asText().split("-");

				this.codiceFiscale = codFiscTinit.length > 1 ? codFiscTinit[1] : codFiscTinit[0];
				if(FilterUtil.DRUPAL_USER.equals(this.codiceFiscale))
					this.codiceRuolo = "DTD";
				else
					this.codiceRuolo = codiceRuolo.get();

				/*se ci troviamo in caso di chiamata a API con HTTP METHOD <> GET 
				 * allora facciamo arricchimento body con codiceFiscale e codiceRuolo
				 * (metodo getCorpoRichiestaArricchitaConDatiContesto)
				 */
				final String inputCorpoRichiesta = this.getCorpoRichiesta(httpServletRequest);
				if(inputCorpoRichiesta != null  && !inputCorpoRichiesta.trim().isEmpty()) {
					this.body = this.getCorpoRichiestaArricchitaConDatiContesto(inputCorpoRichiesta);
				}
			}else if(FilterUtil.isEndpointQuestionarioCompilatoAnonimo(endpoint) && metodoHttp.equals("POST")){
				/*
				 * aggiunta a causa del fatto che l'api
				 * POST - /servizio/cittadino/questionarioCompilato/{idQuestionario}/compila/anonimo  
				 * (questionario compilato da cittadino) non prevede alcun token jwt 
				 * ma al contrario il token applicativo per id questionario
				 * quindi il filtro fa passare la chiamata ma occorre fare il pass-through del body
				 */
				body = this.getCorpoRichiesta(httpServletRequest);
			}
		}
	}

	public String getCorpoRichiesta(final HttpServletRequest httpServletRequest) throws IOException, ServletException {
		
		
		Enumeration paramNames = httpServletRequest.getParameterNames();
		while(paramNames.hasMoreElements()) {
		    System.out.println((String) paramNames.nextElement());
		}
		
		if(httpServletRequest.getInputStream() == null) {
			return null;
		}

		final StringBuilder stringBuilder = new StringBuilder();
		try ( InputStream inputStream = httpServletRequest.getInputStream();
				BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream)); ) {
			final char[] buffer = new char[FilterUtil.SIZE_BUFFER];
			int bytesRead = -1;
			while ( (bytesRead = bufferedReader.read(buffer) ) > 0) {
				stringBuilder.append(buffer, 0, bytesRead);
			}
		} catch (IOException ex) {
			throw ex;
		}
		return stringBuilder.toString();
	}

	public String getCorpoRichiestaArricchitaConDatiContesto(final String corpoRichiesta) throws Exception {
		final JsonNode jsonNode = objectMapper.readTree(corpoRichiesta);
		final ObjectNode objectNode = (ObjectNode) jsonNode;

		objectNode.put(FilterUtil.CODICE_FISCALE, this.codiceFiscale);	// setting valore con decodifica auth_token 
		objectNode.put(FilterUtil.CODICE_RUOLO, this.codiceRuolo);

		return jsonNode.toString();
	}

	@Override
	public ServletInputStream getInputStream() throws IOException {
		final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(this.body.getBytes());
		final ServletInputStream servletInputStream = new ServletInputStream() {
			public int read() throws IOException {
				return byteArrayInputStream.read();
			}

			@Override
			public boolean isFinished() {
				return false;
			}

			@Override
			public boolean isReady() {
				return false;
			}

			@Override
			public void setReadListener(ReadListener listener) {

			}
		};
		return servletInputStream;
	}

	@Override
	public BufferedReader getReader() throws IOException {
		return new BufferedReader(new InputStreamReader(this.getInputStream()));
	}

	private static String decode(String encodedString) {
		return new String(Base64.getUrlDecoder().decode(encodedString));
	}

	private Map<String, String> getRequestHeaders(HttpServletRequest request) {
		Map<String, String> headersMap = new HashMap<String, String>();

		Enumeration<String> headersName = request.getHeaderNames();


		while (headersName.hasMoreElements()) {
			String headerName  = (String) headersName.nextElement();
			String headerValue = request.getHeader(headerName);
			headersMap.put(headerName, headerValue);
		}
		return headersMap;
	}

	public String getCodiceFiscale() {
		return this.codiceFiscale;
	}

	public String getCodiceRuolo() {
		return this.codiceRuolo;
	}
}