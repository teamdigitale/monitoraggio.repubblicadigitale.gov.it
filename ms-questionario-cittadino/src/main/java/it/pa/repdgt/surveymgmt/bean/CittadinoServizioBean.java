package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;

import org.springframework.data.domain.Page;

import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CittadinoServizioBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private Integer numCittadini;
	
	private Long numQuestionariCompilati;
	
	private Page<CittadinoServizioProjection> listaCittadiniServizio;
}
