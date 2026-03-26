package it.pa.repdgt.surveymgmt.request;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RicercaCittadinoRequest {

    @NotNull
    @JsonProperty("codiceRuoloUtenteLoggato")
    private String codiceRuoloUtenteLoggato;

    @NotNull
    @JsonProperty("cfUtenteLoggato")
    private String cfUtenteLoggato;

    @JsonProperty("criterioRicerca")
    private String criterioRicerca;

    @JsonProperty("criterioRicercaMultipla")
    private List<String> criterioRicercaMultipla;

}
