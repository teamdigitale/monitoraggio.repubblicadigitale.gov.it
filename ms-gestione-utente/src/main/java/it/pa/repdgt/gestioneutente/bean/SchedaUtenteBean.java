package it.pa.repdgt.gestioneutente.bean;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SchedaUtenteBean {
	private DettaglioUtenteBean dettaglioUtente;
	private List<DettaglioRuoliBean> dettaglioRuolo;
	private String immagineProfilo;
}
