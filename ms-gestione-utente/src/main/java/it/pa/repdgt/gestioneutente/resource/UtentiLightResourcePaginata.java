package it.pa.repdgt.gestioneutente.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@JsonRootName(value = "utentiResourcePaginati")
public class UtentiLightResourcePaginata implements Serializable{
	private static final long serialVersionUID = 6984486132194816490L;

	@JsonProperty(value = "utenti")
	private List<UtenteDto> listaUtenti;
	
	@JsonProperty(value = "numeroPagine")
	private int numeroPagine;
}
