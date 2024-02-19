package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum StatoQuestionarioEnum {
	NON_COMPILATA("NON_COMPILATA"),
	INVIATO("INVIATO"),
	COMPILATA("COMPILATA");

	private String value;

	private StatoQuestionarioEnum(String value) {
		this.value = value;
	}
}