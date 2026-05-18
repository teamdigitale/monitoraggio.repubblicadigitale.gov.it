package it.pa.repdgt.surveymgmt.collection.payload;

import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Singola voce dell'array "properties" di una sezione del questionario.
 *
 * I dati in MongoDB presentano tre varianti del medesimo concetto
 * (gestite dal deserializer custom {@link RispostaDomandaDeserializer}):
 * <ul>
 *   <li>stringa Python-dict — es. <code>"{'25': ['valore']}"</code></li>
 *   <li>oggetto JSON proper — es. <code>{"25":["valore"]}</code></li>
 *   <li>oggetto Python-dict — es. <code>{'25':['valore']}</code></li>
 * </ul>
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
