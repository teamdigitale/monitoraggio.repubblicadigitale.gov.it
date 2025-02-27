package it.pa.repdgt.shared.resources;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class WarningResource {
    private Boolean warning;
	private String warningMessage;
}
