package it.pa.repdgt.programmaprogetto.bean;

import java.util.List;

import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;
import it.pa.repdgt.shared.entity.light.QuestionarioTemplateLightEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SchedaProgrammaBean {
	private DettaglioProgrammaBean dettaglioProgramma;
	private List<ProgettoLightEntity> progetti;
	private List<QuestionarioTemplateLightEntity> questionari;
	private Long idEnteGestoreProgramma;
}