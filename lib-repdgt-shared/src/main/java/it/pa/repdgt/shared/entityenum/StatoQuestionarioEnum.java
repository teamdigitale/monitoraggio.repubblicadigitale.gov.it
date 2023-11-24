package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum StatoQuestionarioEnum {
	NON_COMPILATO("NON COMPILATO"),
	INVIATO("INVIATO"),
	COMPILATO("COMPILATO");

	private String value;

	private StatoQuestionarioEnum(String value) {
		this.value = value;
	}
}