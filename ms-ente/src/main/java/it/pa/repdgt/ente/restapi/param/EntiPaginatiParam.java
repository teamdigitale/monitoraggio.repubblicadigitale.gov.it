package it.pa.repdgt.ente.restapi.param;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import it.pa.repdgt.ente.request.FiltroRequest;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
@ToString
public class EntiPaginatiParam extends SceltaProfiloParam implements Serializable{
	private static final long serialVersionUID = -4832858079085429345L;
	
	private FiltroRequest filtroRequest;
}
