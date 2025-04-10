package it.pa.repdgt.surveymgmt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProgrammaDaAbilitareDTO {

    private Long idProgramma;
    private String nomeProgramma;
    private String codiceProgramma;
    private String intervento;
    
}
