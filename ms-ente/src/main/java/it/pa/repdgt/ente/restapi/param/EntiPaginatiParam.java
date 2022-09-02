package it.pa.repdgt.ente.restapi.param;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import it.pa.repdgt.ente.request.FiltroRequest;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
@ToString
public class EntiPaginatiParam implements Serializable {
	private static final long serialVersionUID = -4832858079085429345L;
	
	@NotNull
	private RuoloUtenteEnum codiceRuolo;
	
	@NotNull
	private String cfUtente;
	
	private Long idProgramma;
	
	private Long idProgetto;
	
	private FiltroRequest filtroRequest;
}
