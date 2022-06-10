package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum StatoQuestionarioEnum {
	 IN_BOZZA("IN BOZZA")
	,COMPLETATO("COMPLETATO")
	;
	
	private String value;
	
	private StatoQuestionarioEnum(String value) {
		this.value = value;
	}
}