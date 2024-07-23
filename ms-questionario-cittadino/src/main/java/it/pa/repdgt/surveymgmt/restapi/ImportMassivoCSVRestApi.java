package it.pa.repdgt.surveymgmt.restapi;

import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVRequest;
import it.pa.repdgt.surveymgmt.service.ImportMassivoCSVService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/importCsv")
public class ImportMassivoCSVRestApi {

    private final ImportMassivoCSVService importMassivoCSVService;
    private final Validator validator;

    @PostMapping()
    public ResponseEntity<String> importCsvData(@RequestBody ElaboratoCSVRequest csvRequest) throws IOException {
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
}
