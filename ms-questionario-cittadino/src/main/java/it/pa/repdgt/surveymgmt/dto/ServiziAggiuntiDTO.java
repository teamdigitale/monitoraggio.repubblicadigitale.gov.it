package it.pa.repdgt.surveymgmt.dto;

import it.pa.repdgt.shared.entity.ServizioEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiziAggiuntiDTO {

    private ServiziElaboratiDTO serviziElaboratiDTO;

    private ServizioEntity servizioEntity;
}
