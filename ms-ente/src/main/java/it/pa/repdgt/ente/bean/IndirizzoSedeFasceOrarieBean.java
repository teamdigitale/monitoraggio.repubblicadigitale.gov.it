package it.pa.repdgt.ente.bean;

import java.util.List;

import it.pa.repdgt.ente.entity.projection.FasciaOrariaAperturaIndirizzoSedeProjection;
import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class IndirizzoSedeFasceOrarieBean {
	private IndirizzoSedeProjection indirizzoSede;
	private List<FasciaOrariaAperturaIndirizzoSedeProjection> fasceOrarieAperturaIndirizzoSede;
}