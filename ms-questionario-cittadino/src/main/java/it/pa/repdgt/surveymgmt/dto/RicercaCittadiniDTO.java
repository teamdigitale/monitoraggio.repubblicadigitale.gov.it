package it.pa.repdgt.surveymgmt.dto;

import java.util.List;

import it.pa.repdgt.shared.entity.VPrimoServizioCittadinoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RicercaCittadiniDTO {

    private List<VPrimoServizioCittadinoEntity> trovati;

    private List<String> nonTrovati;

}
