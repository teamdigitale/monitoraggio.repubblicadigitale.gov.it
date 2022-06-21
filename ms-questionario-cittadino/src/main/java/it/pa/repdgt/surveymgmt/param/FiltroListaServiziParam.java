package it.pa.repdgt.surveymgmt.param;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Dati filtri di ricerca che il FE manda al BE
 * per la richiesta dell'elenco dei servizi 
 * (Vedi pagina Elenco Servizi 'dropdown filtri ricerca')
 * */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FiltroListaServiziParam {
	private String criterioRicerca;
	private List<String> tipologieServizi;
	private List<String> statiServizio;
}