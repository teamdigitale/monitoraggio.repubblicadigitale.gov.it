package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum StatoQuestionarioEnum {
	NON_INVIATO("NON INVIATO")
	,INVIATO("INVIATO")
	,COMPILATO("COMPILATO")
	;
	
	private String value;
	
	private StatoQuestionarioEnum(String value) {
		this.value = value;
	}
}