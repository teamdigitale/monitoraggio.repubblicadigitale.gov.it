package it.pa.repdgt.ente.bean;

import java.util.List;

import it.pa.repdgt.ente.entity.projection.EnteProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchedaEnteGestoreBean {
	private EnteProjection ente;
	private List<UtenteProjection> referentiEnteGestore;
	private List<UtenteProjection> delegatiEnteGestore;
}