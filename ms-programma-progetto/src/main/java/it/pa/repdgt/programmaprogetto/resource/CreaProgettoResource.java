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
public class CreaProgettoResource extends WarningResource {
	private Long idProgettoCreato;

	public CreaProgettoResource(Long idProgettoCreato, Boolean warning, String warningMessage, String warningTitle) {
        super(warning, warningMessage, warningTitle);
        this.idProgettoCreato = idProgettoCreato;
    }
}
