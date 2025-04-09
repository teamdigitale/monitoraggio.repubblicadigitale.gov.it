package it.pa.repdgt.surveymgmt.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.surveymgmt.dto.ConfigurazioneMinorenniDto;
import it.pa.repdgt.surveymgmt.service.ConfigurazioneMinorenniService;


@RestController
@RequestMapping(path = "/configurazioneminorenni")
public class ConfigurazioneMinorenniRestApi {
    
    @Autowired
    private ConfigurazioneMinorenniService configurazioneMinorenniService;

    @GetMapping(path = "/dettaglio")
    @ResponseStatus(value = HttpStatus.OK)
    public ConfigurazioneMinorenniDto getConfigurazioneMinorenniByIdServizioOrIdProgramma(
        @RequestParam(required = false, name = "idServizio") Long idServizio, 
        @RequestParam(required = false, name = "idProgramma") Long idProgramma) {

            if (idServizio == null && idProgramma == null) {
                throw new IllegalArgumentException("Almeno uno tra 'idServizio' o 'idProgramma' deve essere valorizzato.");
            }

        return configurazioneMinorenniService.getConfigurazioneMinorenniByIdServizioOrIdProgramma(idServizio, idProgramma);

    }
    
}
