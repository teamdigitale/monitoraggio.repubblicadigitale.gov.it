package it.pa.repdgt.surveymgmt.model;

import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElaboratoCSVRequest {

    private List<ServiziElaboratiDTO> serviziValidati;

    private List<ServiziElaboratiDTO> serviziScartati;

}
