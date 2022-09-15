package it.pa.repdgt.programmaprogetto.request;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonRootName(value="sceltaContesto")
public class ProgrammiParam extends SceltaProfiloParam implements Serializable {
	private static final long serialVersionUID = -1681717957321564055L;

	@NotNull(message = "Deve essere non null")
	@JsonProperty(value = "filtroRequest", required = true)
	private FiltroRequest filtroRequest;
}