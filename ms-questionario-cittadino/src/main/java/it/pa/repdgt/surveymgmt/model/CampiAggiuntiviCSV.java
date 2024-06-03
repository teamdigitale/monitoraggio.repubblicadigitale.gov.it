package it.pa.repdgt.surveymgmt.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CampiAggiuntiviCSV {
    private Integer numeroRiga;
    private String note;
    private String idFacilitatore;
    private String nominativoFacilitatore;
    private String nominativoSede;
    private String primoUtilizzoServizioFacilitazione;
    private String serviziPassatiFacilitazione;
    private String tipologiaServiziPrenotato;
    private String competenzeTrattatePrimoLivello;
    private String competenzeTrattateSecondoLivello;
    private String ambitoServiziDigitaliTrattati;
    private String descrizioneDettagliServizio;
    private String modalitaConoscenzaServizioPrenotato;
    private String motivoPrenotazione;
    private String valutazioneRipetizioneEsperienza;
    private String ambitoFacilitazioneFormazioneInteressato;
    private String risoluzioneProblemiDigitali;
    private String valutazioneInStelle;
}
