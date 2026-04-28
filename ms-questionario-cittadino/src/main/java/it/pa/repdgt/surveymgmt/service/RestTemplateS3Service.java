package it.pa.repdgt.surveymgmt.service;

import lombok.RequiredArgsConstructor;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@Service
@RequiredArgsConstructor
public class RestTemplateS3Service {

    /**
     * Upload di un documento via pre-signed URL.
     *
     * Mitigation V04 (SSRF) — defense in depth: la URL deve essere generata
     * dall'AWS SDK (registroAttivitaService.generateUploadPresignedUrl), che
     * la limita al bucket S3 configurato. Validiamo comunque che l'host sia
     * un endpoint AWS noto: se la URL fosse manipolata in futuro a causa di
     * un bug a monte, questo check blocca la richiesta. Snyk riconosce questo
     * pattern come sanitizer per CWE-918.
     */
    public void uploadDocument(String url, ByteArrayOutputStream file) throws IOException {
        validateAwsUrl(url);
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try {
            HttpPut uploadFile = new HttpPut(url);
            ByteArrayEntity byteArrayEntity = new ByteArrayEntity(file.toByteArray());

            uploadFile.setEntity(byteArrayEntity);
            uploadFile.setHeader("Content-Type", "application/octet-stream");

            httpClient.execute(uploadFile);
        } finally {
            httpClient.close();
        }
    }

    private static void validateAwsUrl(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL upload non puo' essere vuoto");
        }
        URI uri;
        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("URL upload non valido", e);
        }
        if (!"https".equalsIgnoreCase(uri.getScheme())) {
            throw new IllegalArgumentException("URL upload deve usare https");
        }
        String host = uri.getHost();
        if (host == null || !host.endsWith(".amazonaws.com")) {
            throw new IllegalArgumentException("Host upload non consentito (atteso *.amazonaws.com)");
        }
    }
}
