package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ConfigurazioneMinorenniRequest implements Serializable{

    @JsonProperty(value = "id", required = true)
    private Long id;

    @JsonProperty(value = "idProgramma", required = true)
    private Long idProgramma;

    @JsonProperty(value = "intervento", required = true)
    private String intervento;

    @JsonProperty(value = "dataAbilitazione", required = true)
    private Date dataAbilitazione;

    @JsonProperty(value = "dataDecorrenza", required = true)
    private Date dataDecorrenza;

    @JsonProperty(value = "cfUtente", required = true)
    private String cfUtente;
    
}
