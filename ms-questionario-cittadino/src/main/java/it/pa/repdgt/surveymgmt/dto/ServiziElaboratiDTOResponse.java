package it.pa.repdgt.surveymgmt.dto;

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
public class ServiziElaboratiDTOResponse {

    private List<ServiziElaboratiDTO> serviziScartati;
    private Integer serviziAggiunti;
    private Integer cittadiniAggiunti;
    private Integer questionariAggiunti;

}
