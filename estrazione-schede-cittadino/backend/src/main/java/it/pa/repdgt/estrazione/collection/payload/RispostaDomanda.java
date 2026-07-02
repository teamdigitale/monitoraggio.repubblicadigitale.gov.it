package it.pa.repdgt.estrazione.collection.payload;

import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Singola voce dell'array "properties" di una sezione del questionario.
 * I dati in MongoDB presentano tre varianti (stringa Python-dict, oggetto
 * JSON valido, oggetto Python-dict) gestite da {@link RispostaDomandaDeserializer}.
 */
@Getter
@Setter
@NoArgsConstructor
@JsonDeserialize(using = RispostaDomandaDeserializer.class)
public class RispostaDomanda {

	private String codiceDomanda;
	private List<String> valori;

	public RispostaDomanda(String codiceDomanda, List<String> valori) {
		this.codiceDomanda = codiceDomanda;
		this.valori = valori == null ? Collections.emptyList() : valori;
	}
}
