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
public class GruppoPermessiResource implements Serializable {
	private static final long serialVersionUID = 4948308858856858488L;

	@JsonProperty("codiceGruppo")
	private String codiceGruppo;
	
	@JsonProperty("codicePermesso")
	private List<String> codicePermesso;
}
