package it.pa.repdgt.surveymgmt.restapi;

import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVRequest;
import it.pa.repdgt.surveymgmt.model.ImportCsvInputData;
import it.pa.repdgt.surveymgmt.service.ImportMassivoCSVService;
import lombok.RequiredArgsConstructor;

import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/importCsv")
public class ImportMassivoCSVRestApi {

    private final ImportMassivoCSVService importMassivoCSVService;
    private final Validator validator;
    private final ObjectMapper objectMapper;

    @PostMapping()
    public ResponseEntity<String> importCsvData(@RequestBody ImportCsvInputData inputData) throws IOException {
        String csvRequestString = decompressGzip(inputData.getFileData());
        ElaboratoCSVRequest csvRequest = objectMapper.readValue(csvRequestString, ElaboratoCSVRequest.class);
        String uuid = UUID.randomUUID().toString();
        for (int i = csvRequest.getServiziValidati().size() - 1; i >= 0; i--) {
            ServiziElaboratiDTO servizioValidato = csvRequest.getServiziValidati().get(i);
            if (valida(servizioValidato)) {
                csvRequest.getServiziScartati().add(csvRequest.getServiziValidati().remove(i));
            }
        }
        importMassivoCSVService.process(csvRequest, uuid);
        return new ResponseEntity<>(uuid, HttpStatus.OK);
    }

    private boolean valida(ServiziElaboratiDTO servizio) {
        Set<ConstraintViolation<ServiziElaboratiDTO>> violations = validator.validate(servizio);
        return !violations.isEmpty();
    }
    private byte[] readAllBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[16384];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return buffer.toByteArray();
    }

    private String decompressGzip(byte[] compressed) throws IOException {
        try (InputStream is = new GzipCompressorInputStream(new ByteArrayInputStream(compressed))) {
            return new String(readAllBytes(is), StandardCharsets.UTF_8);
        }
    }
}
