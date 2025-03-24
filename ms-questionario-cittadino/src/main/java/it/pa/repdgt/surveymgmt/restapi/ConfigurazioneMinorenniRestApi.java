package it.pa.repdgt.surveymgmt.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public ConfigurazioneMinorenniDto getConfigurazioneMinorenniByIdServizio(@RequestBody Long idServizio) {

        return configurazioneMinorenniService.getConfigurazioneMinorenniByIdServizio(idServizio);

    }
    
}
