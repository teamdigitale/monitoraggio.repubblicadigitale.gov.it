package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;
import java.util.List;

import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CittadinoServizioBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private Integer numCittadini;
	
	private Long numQuestionariCompilati;
	
	private List<CittadinoServizioProjection> listaCittadiniServizio;
}
