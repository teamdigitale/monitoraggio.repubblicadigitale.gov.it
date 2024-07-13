package it.pa.repdgt.surveymgmt.dto;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NuovoCittadinoDTO {

    CittadinoEntity cittadinoEntity;

    boolean nuovoCittadino;

}
