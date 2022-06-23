package it.pa.repdgt.programmaprogetto.bean;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;
import it.pa.repdgt.shared.entity.light.QuestionarioTemplateLightEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "SchedaProgramma")
public class SchedaProgrammaBean implements Serializable {
	private static final long serialVersionUID = -1349130986345593975L;
	
	@JsonProperty(value = "dettagliInfoProgramma")
	private DettaglioProgrammaBean dettaglioProgramma;
	@JsonProperty(value = "progetti")
	private List<ProgettoLightEntity> progetti;
	@JsonProperty(value = "questionari")
	private List<QuestionarioTemplateLightEntity> questionari;
	@JsonProperty(value = "idEnteGestoreProgramma")
	private Long idEnteGestoreProgramma;
}