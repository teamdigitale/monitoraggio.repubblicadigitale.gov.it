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
@JsonRootName(value = "programmiLightResourcePaginati")
public class ProgrammiLightResourcePaginata implements Serializable {
	private static final long serialVersionUID = 5215469059499421394L;

	@JsonProperty(value = "programmiLight")
	private List<ProgrammaLightResource> listaProgrammiLight;
	
	@JsonProperty(value = "numeroPagine")
	private int numeroPagine;
}
