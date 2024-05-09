package it.pa.repdgt.surveymgmt.components;

import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import it.pa.repdgt.surveymgmt.model.HeaderCSV;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ServiziElaboratiCsvWriter extends GenericImportCsvWriter<ServiziElaboratiDTO, HeaderCSV> {

    public ServiziElaboratiCsvWriter() {
        super(HeaderCSV.class);
    }

    @Override
    protected String getRaw(List<ServiziElaboratiDTO> models, String headers) {
        StringBuilder fileContent = new StringBuilder(headers);
        for (ServiziElaboratiDTO model : models) {
            convertFieldsToRiga(model, fileContent);
        }
        return fileContent.toString();

    }

    private void convertFieldsToRiga(ServiziElaboratiDTO model, StringBuilder fileContent) {
        fileContent.append("\n");
        fileContent.append(model.getCampiAggiuntiviCSV().getIdFacilitatore()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getNominativoFacilitatore()).append(",");
        fileContent.append(model.getServizioRequest().getIdSedeServizio().toString()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getNominativoSede()).append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getCodiceFiscale()).append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getCodiceFiscaleNonDisponibile().toString())
                .append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getTipoDocumento() != null
                ? model.getNuovoCittadinoServizioRequest().getTipoDocumento()
                : "").append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getNumeroDocumento() != null
                ? model.getNuovoCittadinoServizioRequest().getNumeroDocumento()
                : "").append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getGenere()).append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getFasciaDiEtaId().toString()).append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getTitoloStudio()).append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getStatoOccupazionale()).append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getCittadinanza()).append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getProvinciaDiDomicilio()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getPrimoUtilizzoServizioFacilitazione() != null
                ? model.getCampiAggiuntiviCSV().getPrimoUtilizzoServizioFacilitazione()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getServiziPassatiFacilitazione() != null
                ? model.getCampiAggiuntiviCSV().getServiziPassatiFacilitazione()
                : "").append(",");
        fileContent.append(model.getServizioRequest().getDataServizio().toString()).append(",");
        fileContent.append(model.getServizioRequest().getDurataServizio()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getTipologiaServiziPrenotato()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getCompetenzeTrattatePrimoLivello()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getCompetenzeTrattateSecondoLivello()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getAmbitoServiziDigitaliTrattati()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio() != null
                ? model.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getModalitaConoscenzaServizioPrenotato() != null
                ? model.getCampiAggiuntiviCSV().getModalitaConoscenzaServizioPrenotato()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getMotivoPrenotazione() != null
                ? model.getCampiAggiuntiviCSV().getMotivoPrenotazione()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getValutazioneRipetizioneEsperienza() != null
                ? model.getCampiAggiuntiviCSV().getValutazioneRipetizioneEsperienza()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getAmbitoFacilitazioneFormazioneInteressato() != null
                ? model.getCampiAggiuntiviCSV().getAmbitoFacilitazioneFormazioneInteressato()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getRisoluzioneProblemiDigitali() != null
                ? model.getCampiAggiuntiviCSV().getRisoluzioneProblemiDigitali()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getValutazioneInStelle() != null
                ? model.getCampiAggiuntiviCSV().getValutazioneInStelle()
                : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getNote());
    }
}
