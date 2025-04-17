package it.pa.repdgt.surveymgmt.restapi;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.surveymgmt.dto.ConfigurazioneMinorenniDto;
import it.pa.repdgt.surveymgmt.dto.ListaConfigurazioniMinorenniPaginatiDTO;
import it.pa.repdgt.surveymgmt.dto.ProgrammaDaAbilitareDTO;
import it.pa.repdgt.surveymgmt.request.ConfigurazioneMinorenniPaginatiRequest;
import it.pa.repdgt.surveymgmt.request.ConfigurazioneMinorenniRequest;
import it.pa.repdgt.surveymgmt.request.RicercaProgrammiDaAbilitareRequest;
import it.pa.repdgt.surveymgmt.service.ConfigurazioneMinorenniService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



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

    @PostMapping(path = "/all")
    @ResponseStatus(value = HttpStatus.OK)
    public ListaConfigurazioniMinorenniPaginatiDTO getAllConfigurazioniMinorenniPaginati(@RequestBody @Valid ConfigurazioneMinorenniPaginatiRequest request) {
        return configurazioneMinorenniService.getAllConfigurazioniMinorenniPaginati(request);
    }
    
    @PostMapping(path = "/salva")
    @ResponseStatus(value = HttpStatus.CREATED)
    public ConfigurazioneMinorenniDto creaOModificaConfigurazioneMinorenni(@RequestBody @Valid ConfigurazioneMinorenniRequest request) {
        return configurazioneMinorenniService.creaOModificaConfigurazioneMinorenni(request);
    }
    

    @PostMapping(path = "/elimina")
    @ResponseStatus(value = HttpStatus.OK)
    public void eliminaConfigurazioneMinorenni(@RequestBody @Valid ConfigurazioneMinorenniRequest request) {
        configurazioneMinorenniService.eliminaConfigurazioneMinorenni(request);
    }


    @PostMapping(path = "/programmi")
    @ResponseStatus(value = HttpStatus.OK)
    public List<ProgrammaDaAbilitareDTO> getAllProgrammi(@RequestBody @Valid RicercaProgrammiDaAbilitareRequest request) {
        return configurazioneMinorenniService.getAllProgrammiDaAbilitare(request);
    }
    
}
