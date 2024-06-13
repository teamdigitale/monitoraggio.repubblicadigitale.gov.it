package it.pa.repdgt.surveymgmt.model;

import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTOResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElaboratoCSVResponse {

    private String fileContent;

    private String fileName;

    private ServiziElaboratiDTOResponse response;

}
