package it.pa.repdgt.shared;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Base64;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class RequestWrapper extends HttpServletRequestWrapper {
	private static final int SIZE_BUFFER = 128;
        private static final String AUTH_TOKEN_HEADER = "authToken";
        private static final String USER_ROLE_HEADER  = "userRole";
        private static final String CODICE_RUOLO = "codiceRuolo";
        private static final String CODICE_FISCALE = "codiceFiscale";
        
        private ObjectMapper objectMapper = new ObjectMapper();
		private String body;
		
        public RequestWrapper(final HttpServletRequest httpServletRequest) throws IOException {
            super(httpServletRequest);
            
            // to fix h2 in memory db
            httpServletRequest.getParameterNames();
            
            Map<String, String> headers = this.getRequestHeaders(httpServletRequest);
            Optional<String> authToken = Optional.ofNullable(headers.get(AUTH_TOKEN_HEADER));
            Optional<String> codiceRuolo = Optional.ofNullable(headers.get(USER_ROLE_HEADER));

            final String inputCorpoRichiesta = this.getCorpoRichiesta(httpServletRequest);
            if(inputCorpoRichiesta != null  && !inputCorpoRichiesta.trim().isEmpty()) {
	            this.body = this.getCorpoRichiestaArricchitaConDatiContesto(inputCorpoRichiesta, authToken, codiceRuolo);
            }
        }

        public String getCorpoRichiesta(final HttpServletRequest httpServletRequest) throws IOException {
			if(httpServletRequest.getInputStream() == null) {
				return null;
			}
    		
    		final StringBuilder stringBuilder = new StringBuilder();
            try ( InputStream inputStream = httpServletRequest.getInputStream();
            	  BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream)); ) {
                final char[] buffer = new char[SIZE_BUFFER];
                int bytesRead = -1;
                while ( (bytesRead = bufferedReader.read(buffer) ) > 0) {
                    stringBuilder.append(buffer, 0, bytesRead);
                }
            } catch (IOException ex) {
                throw ex;
            }
			return stringBuilder.toString();
		}
        
    	public String getCorpoRichiestaArricchitaConDatiContesto(final String corpoRichiesta, Optional<String> jwt, Optional<String> codiceRuolo) throws JsonProcessingException, JsonMappingException {
			final JsonNode jsonNode = objectMapper.readTree(corpoRichiesta);
			final ObjectNode objectNode = (ObjectNode) jsonNode;
			

			/*prova decode payload jwt esempio
			 * {
				    "iss": "Online JWT Builder",
				    "iat": 1653487398,
				    "exp": 1685023398,
				    "aud": "www.example.com",
				    "sub": "jrocket@example.com",
				    "GivenName": "Johnny",
				    "Surname": "Rocket",
				    "Email": "jrocket@example.com",
				    "Role": [
				        "Manager",
				        "Project Administrator"
				    ]
				}
			 */
			//JWT esempio
//			jwt="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9."
//					+ "eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NTM0ODczOTgsImV4cCI6MTY4NTAyMzM5OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0."
//					+ "AXZ8TntEPAjbdzHrPCp7UKrems7bX1pxj7g7DNOvni4";
			//split JWT into 3 parts with . delimiter (part 1 = HEADER, part 2 = PAYLOAD, part 3 = SIGNATURE (Algorith (header + payload), secretKey)
			if(jwt.isPresent()) {
				//String header = decode(parts[0]);
				String[] parts = jwt.get().split("\\.");
				String jwtPayload = decode(parts[1]); //TODO: mappare da stringa a oggetto il payload
			}
				
//			System.out.println("JWT DECODIFICATO: " + payload);
			//String signature = decode(parts[2]);
			//////////////////////////////////////////////////////////////////
//			objectNode.put(CODICE_FISCALE, jwtPayload.getCodiceFiscale);	// setting valore con decodifica auth_token 
			if(codiceRuolo.isPresent()) {
				//	objectNode.put(CODICE_RUOLO, codiceRuolo);
			}
		
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
}