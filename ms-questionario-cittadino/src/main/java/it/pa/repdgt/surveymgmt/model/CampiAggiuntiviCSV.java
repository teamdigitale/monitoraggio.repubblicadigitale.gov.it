package it.pa.repdgt.surveymgmt.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CampiAggiuntiviCSV {
    private Integer numeroRiga;
    private String note;
    private String idFacilitatore;
    private String nominativoFacilitatore;
    @NotBlank
    private String nominativoSede;
    private String primoUtilizzoServizioFacilitazione;
    private String serviziPassatiFacilitazione;
    private String tipologiaServiziPrenotato;
    private String competenzeTrattatePrimoLivello;
    private String competenzeTrattateSecondoLivello; // 26
    private String ambitoServiziDigitaliTrattati; // 27
    private String descrizioneDettagliServizio; // 28
    private String modalitaConoscenzaServizioPrenotato;
    private String motivoPrenotazione;
    private String valutazioneRipetizioneEsperienza;
    private String ambitoFacilitazioneFormazioneInteressato;
    private String risoluzioneProblemiDigitali;
    private String valutazioneInStelle;
}
