package it.pa.repdgt.surveymgmt.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.surveymgmt.dto.ConfigurazioneMinorenniDto;
import it.pa.repdgt.surveymgmt.repository.ConfigurazioneMinorenniRepository;

@Service
public class ConfigurazioneMinorenniService {

    @Autowired
    private ConfigurazioneMinorenniRepository configurazioneMinorenniRepository;

    @LogMethod
    @LogExecutionTime
    public ConfigurazioneMinorenniDto getConfigurazioneMinorenniByIdServizioOrIdProgramma(Long idServizio, Long idProgramma) {

        Optional<ConfigurazioneMinorenniEntity> confMinorenniOpt = configurazioneMinorenniRepository
                .findConfigurazioneByIdServizioOrIdProgramma(idServizio, idProgramma);

        if (confMinorenniOpt.isEmpty()) {
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
}
