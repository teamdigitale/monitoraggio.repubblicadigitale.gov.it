package it.pa.repdgt.ente.bean;

import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class IndirizzoSedeFasceOrarieBean {
	private IndirizzoSedeProjection indirizzoSede;
	private IndirizzoSedeFasciaOrariaEntity fasceOrarieAperturaIndirizzoSede;
}