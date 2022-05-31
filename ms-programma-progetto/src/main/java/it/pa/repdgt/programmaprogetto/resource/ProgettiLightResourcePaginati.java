package it.pa.repdgt.programmaprogetto.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@JsonRootName(value = "progettiLightResourcePaginati")
public class ProgettiLightResourcePaginati implements Serializable {
	private static final long serialVersionUID = 2008287271858904552L;

	@JsonProperty(value = "progettiLight")
	private List<ProgettoLightResource> listaProgettiLight;
	
	@JsonProperty(value = "numeroPagine")
	private int numeroPagine;
}