package it.pa.repdgt.surveymgmt.model;

import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTOResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.ByteArrayOutputStream;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElaboratoCSVResponse {

    private ByteArrayOutputStream fileContent;

    private String fileName;

    private ServiziElaboratiDTOResponse response;

}
