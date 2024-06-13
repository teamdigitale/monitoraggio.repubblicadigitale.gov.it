package it.pa.repdgt.surveymgmt.dto;

import it.pa.repdgt.surveymgmt.model.CampiAggiuntiviCSV;
import it.pa.repdgt.surveymgmt.request.NuovoCittadinoServizioRequest;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoRequest;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiziElaboratiDTO {

    private ServizioRequest servizioRequest;
    private NuovoCittadinoServizioRequest nuovoCittadinoServizioRequest;
    private QuestionarioCompilatoRequest questionarioCompilatoRequest;
    private CampiAggiuntiviCSV campiAggiuntiviCSV;

}
