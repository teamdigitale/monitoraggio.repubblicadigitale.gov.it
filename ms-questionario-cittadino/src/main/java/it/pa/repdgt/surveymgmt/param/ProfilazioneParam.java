package it.pa.repdgt.surveymgmt.param;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import lombok.Getter;
import lombok.Setter;

/**
 * Dati di profilazione dell'utente loggato alla piattaforma
 * (Vedi Dropdown 'scelta profilo').
 * */
@Setter
@Getter
public class ProfilazioneParam implements Serializable {
	private static final long serialVersionUID = 1627337338160627190L;

	// Codice fiscale dell'utente loggato alla piattaforma
	@NotBlank
	private String codiceFiscaleUtenteLoggato;

	// Ruolo dell'utente loggato,
	// scelto in fase di profilazione (dropdwon scelta profilo)
	@NotNull
	private RuoloUtenteEnum codiceRuoloUtenteLoggato;
	
	// Id del programma scelto dall'utente loggato,
	// in fase di profilazione (dropdwon scelta profilo)
	private Long idProgramma;
	
	// Id del progetto scelto dall'utente loggato,
	// in fase di profilazione (dropdwon scelta profilo)
	private Long idProgetto;
}