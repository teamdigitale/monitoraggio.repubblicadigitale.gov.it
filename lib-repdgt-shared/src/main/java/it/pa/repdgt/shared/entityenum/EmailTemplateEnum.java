package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum EmailTemplateEnum {
	 CONSENSO("templ_consenso","Presa visione dell’informativa privacy – Repubblica digitale")
	,GEST_PROG("templ_gestore_programma","Ti diamo il benvenuto su Repubblica Digitale")
	,GEST_PROGE_PARTNER("templ_gest_prog_and_partner","Ti diamo il benvenuto su Repubblica Digitale")
	,FACILITATORE("templ_facilitatore","Ti diamo il benvenuto su Repubblica Digitale")
	,RUOLO_CUSTOM("templ_custom","Ti diamo il benvenuto su Repubblica Digitale")
	,QUESTIONARIO_ONLINE("templ_quest_online","Compila il questionario di Repubblica Digitale")
	;
	
	private String valueTemplate;
	private String valueTemplateSubject;
	
	private EmailTemplateEnum(String valueTemplate, String valueTemplateSubject) {
		this.valueTemplate = valueTemplate;
		this.valueTemplateSubject = valueTemplateSubject;
	}
}