package it.pa.repdgt.programmaprogetto.bean;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SchedaProgettoBean {
	private DettaglioProgettoBean dettaglioProgetto;
	private List<DettaglioEntiPartnerBean> entiPartner;
	private List<DettaglioSediBean> sedi;
	private Long idEnteGestoreProgetto;
}