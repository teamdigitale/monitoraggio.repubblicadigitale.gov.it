package it.pa.repdgt.surveymgmt.components;

import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import it.pa.repdgt.surveymgmt.model.HeaderCSV;
import it.pa.repdgt.surveymgmt.util.CSVMapUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class ServiziElaboratiCsvWriter extends GenericImportCsvWriter<ServiziElaboratiDTO, HeaderCSV> {

    public ServiziElaboratiCsvWriter() {
        super(HeaderCSV.class);
    }


    @Override
    protected String getRaw(List<ServiziElaboratiDTO> models, String headers) {
        StringBuilder fileContent = new StringBuilder(headers);
        for (int i = 0; i < models.size(); i++) {
            ServiziElaboratiDTO model = models.get(i);
            convertFieldsToRiga(model, fileContent, i);
        }
        return fileContent.toString();
    }
    

    private void convertFieldsToRiga(ServiziElaboratiDTO model, StringBuilder fileContent, Integer i) {
        fileContent.append("\n");
        fileContent.append(model.getCampiAggiuntiviCSV().getNumeroRiga()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getNote()).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getIdFacilitatore() != null ? model.getCampiAggiuntiviCSV().getIdFacilitatore() : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getNominativoFacilitatore() != null ? model.getCampiAggiuntiviCSV().getNominativoFacilitatore() : "").append(",");
        fileContent.append("").append(","); //ID SEDE
        fileContent.append(model.getCampiAggiuntiviCSV().getNominativoSede() != null ? model.getCampiAggiuntiviCSV().getNominativoSede() : "").append(",");
        fileContent.append("").append(","); //CODICE FISCALE
        if (model.getNuovoCittadinoServizioRequest().getCodiceFiscaleNonDisponibile() != null &&
                model.getNuovoCittadinoServizioRequest().getCodiceFiscaleNonDisponibile()) {
            fileContent.append("SI").append(",");
        } else {
            fileContent.append("NO").append(",");
        }
        fileContent.append(model.getNuovoCittadinoServizioRequest().getTipoDocumento() != null ? model.getNuovoCittadinoServizioRequest().getTipoDocumento() : "").append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getNumeroDocumento() != null ? model.getNuovoCittadinoServizioRequest().getNumeroDocumento() : "").append(",");
        fileContent.append(CSVMapUtil.getAN7Map().get(model.getNuovoCittadinoServizioRequest().getGenere()) != null ? CSVMapUtil.getAN7Map().get(model.getNuovoCittadinoServizioRequest().getGenere()) : "").append(",");
        if (model.getNuovoCittadinoServizioRequest().getFasciaDiEtaId() != null) {
            fileContent.append(CSVMapUtil.getAN8Map().get(model.getNuovoCittadinoServizioRequest().getFasciaDiEtaId().toString()) != null ? CSVMapUtil.getAN8Map().get(model.getNuovoCittadinoServizioRequest().getFasciaDiEtaId().toString()) : "").append(",");
        } else {
            fileContent.append("").append(",");
        }
        fileContent.append(CSVMapUtil.getAN9Map().get(model.getNuovoCittadinoServizioRequest().getTitoloStudio()) != null ? CSVMapUtil.getAN9Map().get(model.getNuovoCittadinoServizioRequest().getTitoloStudio()) : "").append(",");
        fileContent.append(CSVMapUtil.getAN10Map().get(model.getNuovoCittadinoServizioRequest().getStatoOccupazionale()) != null ? CSVMapUtil.getAN10Map().get(model.getNuovoCittadinoServizioRequest().getStatoOccupazionale()) : "").append(",");
        fileContent.append(CSVMapUtil.getAN11Map().get(model.getNuovoCittadinoServizioRequest().getCittadinanza()) != null ? CSVMapUtil.getAN11Map().get(model.getNuovoCittadinoServizioRequest().getCittadinanza()) : "").append(",");
        fileContent.append(model.getNuovoCittadinoServizioRequest().getProvinciaDiDomicilio() != null ? model.getNuovoCittadinoServizioRequest().getProvinciaDiDomicilio() : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getPrimoUtilizzoServizioFacilitazione() != null ? model.getCampiAggiuntiviCSV().getPrimoUtilizzoServizioFacilitazione() : "").append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getServiziPassatiFacilitazione() != null ? model.getCampiAggiuntiviCSV().getServiziPassatiFacilitazione() : "", CSVMapUtil.getPR2Map())).append(",");
        fileContent.append(model.getServizioRequest().getDataServizio() != null ? formattaData(model.getServizioRequest().getDataServizio()) : "").append(",");
        fileContent.append(model.getServizioRequest().getDurataServizio() != null ? model.getServizioRequest().getDurataServizio() : "").append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getTipologiaServiziPrenotato(), CSVMapUtil.getSE3Map()) != null ? appendSplitValues(model.getCampiAggiuntiviCSV().getTipologiaServiziPrenotato(), CSVMapUtil.getSE3Map()) : "").append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getCompetenzeTrattatePrimoLivello(), CSVMapUtil.getSE4Map()) != null ? appendSplitValues(model.getCampiAggiuntiviCSV().getCompetenzeTrattatePrimoLivello(), CSVMapUtil.getSE4Map()) : "").append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getCompetenzeTrattateSecondoLivello(), CSVMapUtil.getSE5Map()) != null ? appendSplitValues(model.getCampiAggiuntiviCSV().getCompetenzeTrattateSecondoLivello(), CSVMapUtil.getSE5Map()) : "").append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getAmbitoServiziDigitaliTrattati(), CSVMapUtil.getSE6Map()) != null ? appendSplitValues(model.getCampiAggiuntiviCSV().getAmbitoServiziDigitaliTrattati(), CSVMapUtil.getSE6Map()) : "").append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio() != null ? model.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio() : "").append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getModalitaConoscenzaServizioPrenotato() != null ? model.getCampiAggiuntiviCSV().getModalitaConoscenzaServizioPrenotato() : "", CSVMapUtil.getES1Map())).append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getMotivoPrenotazione() != null ? model.getCampiAggiuntiviCSV().getMotivoPrenotazione() : "", CSVMapUtil.getES2Map())).append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getValutazioneRipetizioneEsperienza() != null ? model.getCampiAggiuntiviCSV().getValutazioneRipetizioneEsperienza() : "", CSVMapUtil.getES3Map())).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getAmbitoFacilitazioneFormazioneInteressato() != null ? model.getCampiAggiuntiviCSV().getAmbitoFacilitazioneFormazioneInteressato() : "").append(",");
        fileContent.append(appendSplitValues(model.getCampiAggiuntiviCSV().getRisoluzioneProblemiDigitali() != null ? model.getCampiAggiuntiviCSV().getRisoluzioneProblemiDigitali() : "", CSVMapUtil.getES5Map())).append(",");
        fileContent.append(model.getCampiAggiuntiviCSV().getValutazioneInStelle() != null ? model.getCampiAggiuntiviCSV().getValutazioneInStelle() : "");
    }

    private String formattaData(Date dataServizio) {
        LocalDate localDate = dataServizio.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return localDate.format(formatter);
    }


    private String appendSplitValues(String value, Map<String, String> map) {
        if (value != null && !value.isEmpty()) {
            String[] values = value.split(": ");
            List<String> mappedValues = new ArrayList<>();
            for (String val : values) {
                String mappedValue = map.get(val);
                if (mappedValue != null) {
                    mappedValues.add(mappedValue);
                }
            }
            return String.join(":", mappedValues);
        }
        return "";
    }
}
