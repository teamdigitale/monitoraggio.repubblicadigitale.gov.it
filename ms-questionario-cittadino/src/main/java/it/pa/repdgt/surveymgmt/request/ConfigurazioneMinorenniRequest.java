package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ConfigurazioneMinorenniRequest implements Serializable{

    @NotNull
    @JsonProperty(value = "id", required = true)
    private Long id;

    @NotNull
    @JsonProperty(value = "idProgramma", required = true)
    private Long idProgramma;

    @NotBlank
    @JsonProperty(value = "intervento", required = true)
    private String intervento;

    @NotNull
    @JsonProperty(value = "dataAbilitazione", required = true)
    private Date dataAbilitazione;

    @NotNull
    @JsonProperty(value = "dataDecorrenza", required = true)
    private Date dataDecorrenza;

    @NotNull
    @JsonProperty(value = "cfUtente", required = true)
    private String cfUtente;
    
}
