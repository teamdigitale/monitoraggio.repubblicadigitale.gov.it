package it.pa.repdgt.ente.bean;

import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class IndirizzoSedeFasceOrarieBean {
	private IndirizzoSedeProjection indirizzoSede;
	private FasciaOrariaBean fasceOrarieAperturaIndirizzoSede;
}