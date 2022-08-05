package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import it.pa.repdgt.surveymgmt.annotation.JsonString;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class QuestionarioCompilatoAnonimoRequest implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@NotNull
	@JsonString
	private String sezioneQ4Questionario;
}