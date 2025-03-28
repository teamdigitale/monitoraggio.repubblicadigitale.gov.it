package it.pa.repdgt.programmaprogetto.resource;

import it.pa.repdgt.shared.resources.WarningResource;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreaProgrammaResource extends WarningResource {
	private Long idProgrammaCreato;

	public CreaProgrammaResource(Long idProgrammaCreato, Boolean warning, String warningMessage, String warningTitle) {
        super(warning, warningMessage, warningTitle);
        this.idProgrammaCreato = idProgrammaCreato;
    }
}
