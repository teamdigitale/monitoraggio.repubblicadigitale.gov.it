package it.pa.repdgt.gestioneutente.bean;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SchedaRuoloBean {
	private DettaglioRuoloBean dettaglioRuolo;
	private List<DettaglioGruppiBean> dettaglioGruppi;
}
