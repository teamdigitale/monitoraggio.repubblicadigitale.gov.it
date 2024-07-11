package it.pa.repdgt.surveymgmt.service;

import lombok.RequiredArgsConstructor;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class RestTemplateS3Service {

    public void uploadDocument(String url, ByteArrayOutputStream file) throws IOException {
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
}
