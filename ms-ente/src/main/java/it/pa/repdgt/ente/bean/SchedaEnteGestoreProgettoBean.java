package it.pa.repdgt.ente.bean;

import java.util.List;

import it.pa.repdgt.ente.entity.projection.EnteProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchedaEnteGestoreProgettoBean {
	private EnteProjection ente;
	private List<UtenteProjection> referentiEnteGestoreProgetto;
	private List<UtenteProjection> delegatiEnteGestoreProgetto;
	private List<SedeBean> sediEnteGestoreProgetto;
}