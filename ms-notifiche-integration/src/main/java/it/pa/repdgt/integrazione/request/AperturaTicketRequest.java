package it.pa.repdgt.integrazione.request;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonRootName(value = "AperturaTicketRequest")
public class AperturaTicketRequest implements Serializable {

    @NotNull
    @JsonProperty(value = "nome")
    private String nome;

    @NotNull
    @JsonProperty(value = "email")
    private String email;
    
    @NotNull
    @JsonProperty(value = "areaTematica")
    private String areaTematica;

    @NotNull
    @JsonProperty(value = "descrizione")
    private String descrizione;

    @NotNull
    @JsonProperty(value = "oggetto")
    private String oggetto;

    @JsonProperty(value = "altraAreaTematica")
    private String altraAreaTematica;

    @JsonProperty(value = "allegati")
    private List<String> allegati;

    @JsonProperty(value = "idProgramma")
    private String idProgramma;

    @JsonProperty(value = "nomeProgramma")
    private String nomeProgramma;

    @JsonProperty(value = "idProgetto")
    private String idProgetto;

    @JsonProperty(value = "nomeProgetto")
    private String nomeProgetto;

    @JsonProperty(value = "policy")
    private String policy;

    @JsonProperty(value = "idEnte")
    private String idEnte;

    @JsonProperty(value = "nomeEnte")
    private String nomeEnte;

}