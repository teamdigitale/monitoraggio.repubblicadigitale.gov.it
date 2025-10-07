package it.pa.repdgt.surveymgmt.restapi;

import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.util.Utils;
import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVRequest;
import it.pa.repdgt.surveymgmt.model.ImportCsvInputData;
import it.pa.repdgt.surveymgmt.service.ImportMassivoCSVService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.io.IOException;
import java.util.List;
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
    public ResponseEntity<String> importCsvData(@RequestBody ImportCsvInputData inputData) throws IOException, ValidationException{
        String csvRequestString = Utils.decompressGzip(inputData.getFileData());
        ElaboratoCSVRequest csvRequest = objectMapper.readValue(csvRequestString, ElaboratoCSVRequest.class);
        String uuid = UUID.randomUUID().toString();
        List<ServiziElaboratiDTO> servizi = !csvRequest.getServiziValidati().isEmpty()
                ? csvRequest.getServiziValidati()
                : csvRequest.getServiziScartati();
        Long idEnte = servizi.get(0).getNuovoCittadinoServizioRequest().getIdEnte();
        Long idProgetto = servizi.get(0).getNuovoCittadinoServizioRequest().getIdProgetto();
        PolicyEnum policy = importMassivoCSVService.recuperaPolicydaProgetto(idProgetto);
        importMassivoCSVService.checkPreliminareCaricamentoMassivo(idEnte, idProgetto);
        for (int i = csvRequest.getServiziValidati().size() - 1; i >= 0; i--) {
            ServiziElaboratiDTO servizioValidato = csvRequest.getServiziValidati().get(i);
            if (valida(servizioValidato)) {
                csvRequest.getServiziScartati().add(csvRequest.getServiziValidati().remove(i));
            }
        }
        importMassivoCSVService.process(csvRequest, uuid, policy, inputData.getEstensioneInput());
        return new ResponseEntity<>(uuid, HttpStatus.OK);
    }

    private boolean valida(ServiziElaboratiDTO servizio) {
        Set<ConstraintViolation<ServiziElaboratiDTO>> violations = validator.validate(servizio);
        return !violations.isEmpty();
    }
}
