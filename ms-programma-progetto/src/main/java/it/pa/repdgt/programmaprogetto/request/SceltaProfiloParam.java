package it.pa.repdgt.programmaprogetto.request;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@JsonRootName(value="sceltaContesto")
public class SceltaProfiloParam {

	@NotBlank(message = "Deve essere non null e non blank")
	@JsonProperty(value = "codiceRuoloUtente", required = true)
	private String codiceRuolo;
	
	@NotBlank(message = "Deve essere non null e non blank")
	@JsonProperty(value = "codiceFiscaleUtente", required = true)
	private String cfUtente;

	// NB: idProgramma=null SSE ruolo utenteLoggato = {DTD, DSCU, ruolo_custom}
	private Long idProgramma;
	
	// NB: idProgetto=null SSE ruolo utenteLoggato = {DTD, DSCU, ruolo_custom, REG, DEG}
	private Long idProgetto;
}