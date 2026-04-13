package it.pa.repdgt.surveymgmt.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrimoServizioCittadinoDTO {

    private Long idCittadino;
    private String codiceFiscale;
    private String genere;
    private String fascia;
    private String titoloDiStudio;
    private String occupazione;
    private String cittadinanza;
    private Long idServizio;
    private String regioneProvincia;
    private String nomeGestore;
    private String cup;
    private String nomeServizio;
    private String nomePuntoFacilitazione;
    private String indirizzoPuntoFacilitazione;
    private String nomeFacilitatore;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Europe/Rome")
    private Date dataServizio;

    private String tipologiaServizio;
    private String competenzaDigitale;

}
