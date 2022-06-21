package it.pa.repdgt.surveymgmt.param;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * Dati filtri di ricerca che il FE manda al BE
 * per la richiesta dell'elenco dei cittadini di un servizio 
 *
 * */
@Setter
@Getter
public class FiltroListaCittadiniServizioParam {
	private String criterioRicerca;
	private List<String> statiQuestionario;
}