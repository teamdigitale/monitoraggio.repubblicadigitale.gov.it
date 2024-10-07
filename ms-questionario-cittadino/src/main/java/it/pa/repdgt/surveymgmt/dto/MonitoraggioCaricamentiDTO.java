package it.pa.repdgt.surveymgmt.dto;

import java.util.List;

import it.pa.repdgt.shared.entity.VMonitoraggioCaricamentiEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonitoraggioCaricamentiDTO {

    private List<VMonitoraggioCaricamentiEntity> monitoraggioCaricamentiEntity;

    private Long numeroEnti;

    private Long numeroCaricamenti;

    private Long serviziCaricati;

    private Long cittadiniCaricati;
    
}
