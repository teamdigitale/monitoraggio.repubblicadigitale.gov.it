package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum EmailTemplateEnum {
	CONSENSO("templ_consenso", "Presa visione dell’informativa privacy – Facilita"),
	GEST_PROG("templ_gestore_programma", "Ti diamo il benvenuto su Facilita"),
	GEST_PROGE_PARTNER("templ_gest_prog_and_partner", "Ti diamo il benvenuto su Facilita"),
	FACILITATORE("templ_facilitatore", "Ti diamo il benvenuto su Facilita"),
	RUOLO_CUSTOM("templ_custom", "Ti diamo il benvenuto su Facilita"),
	QUESTIONARIO_ONLINE("templ_quest_online", "%s - Compila il questionario di Facilita");

	private String valueTemplate;
	private String valueTemplateSubject;

	private EmailTemplateEnum(String valueTemplate, String valueTemplateSubject) {
		this.valueTemplate = valueTemplate;
		this.valueTemplateSubject = valueTemplateSubject;
	}
}