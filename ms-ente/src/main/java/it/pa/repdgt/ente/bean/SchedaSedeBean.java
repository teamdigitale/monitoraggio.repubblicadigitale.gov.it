package it.pa.repdgt.ente.bean;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(value = Include.NON_NULL)
public class SchedaSedeBean {
	private DettaglioProgettoLightBean dettaglioProgetto;
	private DettaglioSedeBean dettaglioSede;
	private List<UtenteProjection> facilitatoriSede;
	private PolicyEnum programmaPolicy;
}