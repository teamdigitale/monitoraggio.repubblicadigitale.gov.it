package it.pa.repdgt.ente.bean;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SchedaEnteBean {
	private DettaglioEnteBean dettagliEnte;
	private List<DettaglioProfiliBean> dettagliProfili;
}
