package it.pa.repdgt.surveymgmt.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportCsvInputData {

    private byte[] fileData;

    private String cfUtenteLoggato;

    private String codiceRuoloUtenteLoggato;

    private Long idEnte;

    private Long idProgetto;

    private Long idProgramma;
}
