package it.pa.repdgt.shared.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.exception.ZendeskException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RestTemplateWrapper {

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Metodo generico per eseguire chiamate HTTP con body JSON.
     * Restituisce il body deserializzato nel tipo specificato da responseType.
     *
     * @param url          URL di destinazione
     * @param method       HttpMethod (GET, POST, PUT, ...)
     * @param jsonBody     corpo già serializzato in JSON (String)
     * @param headers      eventualmente header custom (se null viene creato uno con Content-Type: application/json)
     * @param responseType tipo di risposta (ParameterizedTypeReference)
     * @param <T>          tipo di ritorno
     * @return risposta deserializzata nel tipo T
     * @throws ZendeskException in caso di errore
     */
    public <T> T httpCall(String url, HttpMethod method, String jsonBody, HttpHeaders headers, ParameterizedTypeReference<T> responseType) throws ZendeskException {
        ResponseEntity<T> response = null;
        try {
            HttpHeaders h = headers != null ? headers : new HttpHeaders();
            if (!h.containsKey(HttpHeaders.CONTENT_TYPE)) {
                h.setContentType(MediaType.APPLICATION_JSON);
            }

            HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody, h);

            log.info("Richiesta {}: url={} headers={} corpoJSON={}", method, url, h, jsonBody);

            response = this.restTemplate.exchange(url, method, requestEntity, responseType);
        } catch (Exception ex) {
            String errorMessage = ex.getMessage() != null && ex.getMessage().contains(":")
                    ? ex.getMessage().replaceFirst(":", "_REQ_ASSISTENZA_")
                    : ex.getMessage();
            String risposta = errorMessage != null && errorMessage.contains("_REQ_ASSISTENZA_")
                    ? errorMessage.split("_REQ_ASSISTENZA_")[1]
                    : errorMessage;
            String messaggioErrore = String.format("%s", risposta);

            log.error("Errore durante la chiamata {} a {}: {}", method, url, messaggioErrore, ex);
            throw new ZendeskException(messaggioErrore, ex, CodiceErroreEnum.ZD00);
        }

        return response != null ? response.getBody() : null;
    }
    
}
