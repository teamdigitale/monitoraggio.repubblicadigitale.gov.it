package it.pa.repdgt.programmaprogetto.request;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@JsonRootName(value="sceltaContesto")
public class ProgrammiParam extends SceltaProfiloParam {
	
	@NotNull
	private FiltroRequest filtroRequest;
}