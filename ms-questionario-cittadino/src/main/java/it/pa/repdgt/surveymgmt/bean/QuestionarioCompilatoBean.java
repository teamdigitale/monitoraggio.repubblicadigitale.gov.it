package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(value = Include.NON_NULL)
public class QuestionarioCompilatoBean implements Serializable {
	private static final long serialVersionUID = -8064312467245241720L;

	private boolean abilitatoConsensoTrattatamentoDatiCittadino;
	private QuestionarioTemplateCollection questionarioTemplate;
}