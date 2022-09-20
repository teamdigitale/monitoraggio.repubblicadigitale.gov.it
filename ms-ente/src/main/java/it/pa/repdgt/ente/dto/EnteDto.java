package it.pa.repdgt.ente.dto;

import java.util.Objects;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnteDto {
	@Override
	public int hashCode() {
		return Objects.hash(id, idP, profilo);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		EnteDto other = (EnteDto) obj;
		return Objects.equals(id, other.id) && Objects.equals(idP, other.idP) && Objects.equals(profilo, other.profilo);
	}
	private String id;
	private String nome;
	private String tipologia;
	private String profilo;
	//id programma/progetto per effettuare distinct su tabella
	private String idP;
	
	
}
