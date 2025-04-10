package it.pa.repdgt.surveymgmt.dto;

import java.util.List;

import it.pa.repdgt.shared.entity.ConfigurazioneMinorenniEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListaConfigurazioniMinorenniPaginatiDTO {

    private List<ConfigurazioneMinorenniEntity> configurazioniMinorenniList;

    private Integer numeroPagine;

    private Long numeroTotaleElementi;

    
}
