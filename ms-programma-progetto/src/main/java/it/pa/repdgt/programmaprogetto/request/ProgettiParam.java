package it.pa.repdgt.programmaprogetto.request;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonRootName(value="sceltaContesto")
public class ProgettiParam extends SceltaProfiloParam {
	
	@NotNull(message = "Deve essere non null")
	@JsonProperty(value = "filtroProgetti")
	private ProgettoFiltroRequest filtroRequest;
}