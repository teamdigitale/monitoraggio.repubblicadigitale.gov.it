package it.pa.repdgt.gestioneutente.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RuoloResource extends RuoloLightResource implements Serializable {
	private static final long serialVersionUID = -7671736402156264308L;

	@JsonProperty(value = "gruppiPermessi")
	private List<GruppoPermessiResource> gruppiPermessi;
}