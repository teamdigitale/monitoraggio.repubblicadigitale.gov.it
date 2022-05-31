package it.pa.repdgt.ente.bean;

import java.util.List;

import it.pa.repdgt.ente.entity.projection.EnteProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchedaEntePartnerBean {
	private EnteProjection ente;
	private List<UtenteProjection> referentiEntePartner;
	private List<UtenteProjection> delegatiEntePartner;
	private List<SedeBean> sediEntePartner;
}