package it.pa.repdgt.surveymgmt.param;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProfilazioneParam implements Serializable {
	private static final long serialVersionUID = 1627337338160627190L;

	@NotNull
	private RuoloUtenteEnum codiceRuoloUtenteLoggato;
	
	@NotBlank
	private String codiceFiscaleUtenteLoggato;
	
	private Long idProgramma;
	
	private Long idProgetto;
}