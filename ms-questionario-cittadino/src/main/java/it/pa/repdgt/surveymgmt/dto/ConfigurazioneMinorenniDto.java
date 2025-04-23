package it.pa.repdgt.surveymgmt.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigurazioneMinorenniDto {
    private Long id;
    private Long idProgramma;
    private String intervento;
    private Date dataAbilitazione;
    private Date dataDecorrenza;
    private Date createTimestamp;
    private String createUser;
    private Date updateTimestamp;
    private String updateUser;
    private String nomeProgramma;
}
