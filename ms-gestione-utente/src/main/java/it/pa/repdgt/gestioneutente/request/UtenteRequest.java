package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class UtenteRequest extends SceltaProfiloParam implements Serializable {
	private static final long serialVersionUID = -6654227879250469320L;
	
	private FiltroRequest filtroRequest;
}
