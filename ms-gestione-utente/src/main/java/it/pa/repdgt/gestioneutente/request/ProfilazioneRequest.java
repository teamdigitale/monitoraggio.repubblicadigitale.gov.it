package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ProfilazioneRequest implements Serializable {
	private static final long serialVersionUID = -6654227879250469320L;

	@JsonProperty(value = "cfUtente")
	@NotBlank
	private String cfUtente;
	
	@NotBlank
	private String codiceRuolo;
	
	private Long idProgramma;
	
	private Long idProgetto;
}