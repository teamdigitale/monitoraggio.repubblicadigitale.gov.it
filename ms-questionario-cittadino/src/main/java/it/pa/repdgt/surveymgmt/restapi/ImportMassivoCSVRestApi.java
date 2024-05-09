package it.pa.repdgt.surveymgmt.restapi;

import it.pa.repdgt.surveymgmt.model.ElaboratoCSVRequest;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVResponse;
import it.pa.repdgt.surveymgmt.service.ImportMassivoCSVService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/import-csv")
public class ImportMassivoCSVRestApi {

    private final ImportMassivoCSVService importMassivoCSVService;

    @PostMapping()
    public ElaboratoCSVResponse importCsvData(@RequestBody @Valid ElaboratoCSVRequest csvRequest) {
        return importMassivoCSVService.process(csvRequest);
    }

}
