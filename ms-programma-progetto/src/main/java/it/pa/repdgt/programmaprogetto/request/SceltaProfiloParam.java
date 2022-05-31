package it.pa.repdgt.programmaprogetto.request;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@JsonRootName(value="sceltaContesto")
public class SceltaProfiloParam {

	@NotBlank
	private String codiceRuolo;
	
	@NotBlank
	private String cfUtente;
	
	private Long idProgramma;
}
