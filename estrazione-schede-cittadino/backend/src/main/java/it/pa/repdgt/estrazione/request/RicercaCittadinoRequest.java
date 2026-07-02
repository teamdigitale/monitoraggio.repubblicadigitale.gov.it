package it.pa.repdgt.estrazione.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * Criterio di ricerca in chiaro (nessuna cifratura di trasporto).
 * - criterioRicerca: usato dalla ricerca singola (id numerico, hash 64-hex o CF in chiaro).
 * - criterioRicercaMultipla: lista di codici usata dalla ricerca multipla.
 */
@Getter
@Setter
public class RicercaCittadinoRequest {

	@JsonProperty("criterioRicerca")
	private String criterioRicerca;

	@JsonProperty("criterioRicercaMultipla")
	private List<String> criterioRicercaMultipla;

}
