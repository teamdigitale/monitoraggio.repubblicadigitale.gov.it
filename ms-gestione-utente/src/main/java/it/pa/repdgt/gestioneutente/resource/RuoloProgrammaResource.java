package it.pa.repdgt.gestioneutente.resource;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RuoloProgrammaResource {

	String codiceRuolo;
	
	String descrizioneRuolo;
	
	String idProgramma;
	
	String nomeProgramma;
	
	String idProgetto;
	
	String nomeEnte;
	
	public RuoloProgrammaResource(String codiceRuolo, String descrizioneRuolo) {
		this.codiceRuolo = codiceRuolo;
		this.descrizioneRuolo = descrizioneRuolo;
	}

	public RuoloProgrammaResource(String codiceRuolo, String descrizioneRuolo, String idProgramma, String nomeProgramma,
			String nomeEnte) {
		super();
		this.codiceRuolo = codiceRuolo;
		this.descrizioneRuolo = descrizioneRuolo;
		this.idProgramma = idProgramma;
		this.nomeProgramma = nomeProgramma;
		this.nomeEnte = nomeEnte;
	}
}
