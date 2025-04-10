package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ConfigurazioneMinorenniEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.dto.ConfigurazioneMinorenniDto;
import it.pa.repdgt.surveymgmt.dto.ListaConfigurazioniMinorenniPaginatiDTO;
import it.pa.repdgt.surveymgmt.dto.ProgrammaDaAbilitareDTO;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.repository.ConfigurazioneMinorenniRepository;
import it.pa.repdgt.surveymgmt.request.ConfigurazioneMinorenniPaginatiRequest;
import it.pa.repdgt.surveymgmt.request.ConfigurazioneMinorenniRequest;
import it.pa.repdgt.surveymgmt.request.RicercaProgrammiDaAbilitareRequest;
@Service
public class ConfigurazioneMinorenniService {

    @Autowired
    private ConfigurazioneMinorenniRepository configurazioneMinorenniRepository;

    @LogMethod
    @LogExecutionTime
    public ConfigurazioneMinorenniDto getConfigurazioneMinorenniByIdServizioOrIdProgramma(Long idServizio, Long idProgramma) {

        Optional<ConfigurazioneMinorenniEntity> confMinorenniOpt = configurazioneMinorenniRepository
                .findConfigurazioneByIdServizioOrIdProgramma(idServizio, idProgramma);

        if (!confMinorenniOpt.isPresent()) {
            // Restituisci un oggetto vuoto
            return new ConfigurazioneMinorenniDto();
        }

        ConfigurazioneMinorenniEntity confMinorenni = confMinorenniOpt.get();
        ConfigurazioneMinorenniDto confMinorenniDto = new ConfigurazioneMinorenniDto();
        confMinorenniDto.setId(confMinorenni.getId());
        confMinorenniDto.setIdProgramma(confMinorenni.getIdProgramma());
        confMinorenniDto.setIntervento(confMinorenni.getIntervento());
        confMinorenniDto.setDataAbilitazione(confMinorenni.getDataAbilitazione());
        confMinorenniDto.setDataDecorrenza(confMinorenni.getDataDecorrenza());
        confMinorenniDto.setCreateTimestamp(confMinorenni.getCreateTimestamp());
        confMinorenniDto.setCreateUser(confMinorenni.getCreateUser());
        confMinorenniDto.setUpdateTimestamp(confMinorenni.getUpdateTimestamp());
        confMinorenniDto.setUpdateUser(confMinorenni.getUpdateUser());
        return confMinorenniDto;
    }


    @LogMethod
    @LogExecutionTime
    public ListaConfigurazioniMinorenniPaginatiDTO getAllConfigurazioniMinorenniPaginati(ConfigurazioneMinorenniPaginatiRequest request){

        Pageable paginazione = createPageable(request.getCurrentPage(),request.getPageSize(), request.getSortBy(), request.getSortOrder());

        Page<ConfigurazioneMinorenniEntity> resultPaginate = this.configurazioneMinorenniRepository.getAllConfigurazioniPaginate(paginazione);

        ListaConfigurazioniMinorenniPaginatiDTO dto = new ListaConfigurazioniMinorenniPaginatiDTO();
        dto.setConfigurazioniMinorenniList(resultPaginate.getContent());
        dto.setNumeroPagine(resultPaginate.getTotalPages());
        dto.setNumeroTotaleElementi(resultPaginate.getTotalElements());

        return dto;
    }

    private Pageable createPageable(int page, int pageSize, String sort, String sortOrder) {
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        return PageRequest.of(page, pageSize, Sort.by(direction, sort));
    }

    @LogMethod
    @LogExecutionTime
    public ConfigurazioneMinorenniDto creaOModificaConfigurazioneMinorenni(ConfigurazioneMinorenniRequest request) {
        ConfigurazioneMinorenniEntity configurazioneMinorenniEntity = new ConfigurazioneMinorenniEntity();
        if(request.getId() != null) {   //modifica
            Optional<ConfigurazioneMinorenniEntity> configurazioneMinorenniOpt = configurazioneMinorenniRepository.findById(request.getId());
            if (configurazioneMinorenniOpt.isPresent()) {
                configurazioneMinorenniEntity = configurazioneMinorenniOpt.get();

                if(configurazioneMinorenniEntity.getDataDecorrenza().before(new Date())){ //verifico che la configurazione non sia già abilitata
                    throw new CittadinoException("Impossibile modificare la configurazione minorenni poiché essa è abilitata", CodiceErroreEnum.M02);
                }

                configurazioneMinorenniEntity.setDataDecorrenza(request.getDataDecorrenza());
                configurazioneMinorenniEntity.setUpdateUser(request.getCfUtente());
                configurazioneMinorenniEntity.setUpdateTimestamp(new Date());
            }else{
                throw new CittadinoException("Configurazione minorenni non trovata", CodiceErroreEnum.M01);
            }
        }else {  //creazione
            configurazioneMinorenniEntity.setIdProgramma(request.getIdProgramma());
            configurazioneMinorenniEntity.setIntervento(request.getIntervento());
            configurazioneMinorenniEntity.setDataAbilitazione(request.getDataAbilitazione());
            configurazioneMinorenniEntity.setDataDecorrenza(request.getDataDecorrenza());
            configurazioneMinorenniEntity.setCreateUser(request.getCfUtente());
            configurazioneMinorenniEntity.setCreateTimestamp(new Date());
            configurazioneMinorenniEntity.setUpdateUser(request.getCfUtente());
            configurazioneMinorenniEntity.setUpdateTimestamp(new Date());
        }

        configurazioneMinorenniRepository.save(configurazioneMinorenniEntity);

        ConfigurazioneMinorenniDto configurazioneMinorenniDto = new ConfigurazioneMinorenniDto();
        configurazioneMinorenniDto.setId(configurazioneMinorenniEntity.getId());
        configurazioneMinorenniDto.setIdProgramma(configurazioneMinorenniEntity.getIdProgramma());
        configurazioneMinorenniDto.setIntervento(configurazioneMinorenniEntity.getIntervento());
        configurazioneMinorenniDto.setDataAbilitazione(configurazioneMinorenniEntity.getDataAbilitazione());
        configurazioneMinorenniDto.setDataDecorrenza(configurazioneMinorenniEntity.getDataDecorrenza());
        configurazioneMinorenniDto.setCreateTimestamp(configurazioneMinorenniEntity.getCreateTimestamp());
        configurazioneMinorenniDto.setCreateUser(configurazioneMinorenniEntity.getCreateUser());
        configurazioneMinorenniDto.setUpdateTimestamp(configurazioneMinorenniEntity.getUpdateTimestamp());
        configurazioneMinorenniDto.setUpdateUser(configurazioneMinorenniEntity.getUpdateUser());

        return configurazioneMinorenniDto;
    }

    @LogMethod
    @LogExecutionTime   
    public void eliminaConfigurazioneMinorenni(ConfigurazioneMinorenniRequest request) {
        Optional<ConfigurazioneMinorenniEntity> configurazioneMinorenniOpt = configurazioneMinorenniRepository.findById(request.getId());
        if (configurazioneMinorenniOpt.isPresent()) {
            ConfigurazioneMinorenniEntity configurazioneMinorenni = configurazioneMinorenniOpt.get();
            if(configurazioneMinorenni.getDataDecorrenza().before(new Date())){ //verifico che la configurazione non sia già abilitata
                throw new CittadinoException("Impossibile cancellare la configurazione minorenni poiché essa è abilitata", CodiceErroreEnum.M02);
            }
            configurazioneMinorenniRepository.delete(configurazioneMinorenni);
        }else{
            throw new CittadinoException("Configurazione minorenni non trovata", CodiceErroreEnum.M01);
        }
    }

    @LogMethod
    @LogExecutionTime
    public List<ProgrammaDaAbilitareDTO> getAllProgrammiDaAbilitare(RicercaProgrammiDaAbilitareRequest request){
        List<ProgrammaEntity> programmi = configurazioneMinorenniRepository.getAllProgrammiDaAbilitare(request.getCriterioRicerca(), ""+ request.getCriterioRicerca() +"", request.getIntervento());
        if(programmi != null && !programmi.isEmpty()){
            return programmi.stream().map(programma -> {
                ProgrammaDaAbilitareDTO programmaDaAbilitareDTO = new ProgrammaDaAbilitareDTO();
                programmaDaAbilitareDTO.setIdProgramma(programma.getId());
                programmaDaAbilitareDTO.setNomeProgramma(programma.getNome());
                programmaDaAbilitareDTO.setCodiceProgramma(programma.getCodice());
                programmaDaAbilitareDTO.setIntervento(programma.getPolicy().toString());
                return programmaDaAbilitareDTO;
            }).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
