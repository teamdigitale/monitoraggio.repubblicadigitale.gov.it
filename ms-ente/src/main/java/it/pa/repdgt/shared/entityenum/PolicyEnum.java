package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum PolicyEnum {
	 SCD("Servizio Civile Digitale")
	,RFD("Rete dei serivizi di Facilitazione Digitale")
	;
	
	private String value;
	
	private PolicyEnum(String value) {
		this.value = value;
	}
}