package it.pa.repdgt.surveymgmt.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RicercaCittadiniDTO {

    private List<PrimoServizioCittadinoDTO> trovati;

    private List<ScartoRicercaDTO> nonTrovati;

}
