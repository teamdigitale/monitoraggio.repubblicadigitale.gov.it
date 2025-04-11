package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
@ToString
public class RicercaProgrammiDaAbilitareRequest implements Serializable{

    @JsonProperty(value = "criterioRicerca")
    private String criterioRicerca;

    @JsonProperty(value = "intervento")
    @NotNull(message = "Specificare un intervento")
    private String intervento;
    
}
