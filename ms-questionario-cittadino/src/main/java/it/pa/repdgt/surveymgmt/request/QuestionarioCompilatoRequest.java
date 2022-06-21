package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import it.pa.repdgt.surveymgmt.annotation.JsonString;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class QuestionarioCompilatoRequest implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private ConsensoTrattamentoDatiRequest ConsensoTrattamentoDatiRequest;
	
	@NotNull
	@JsonString
	private String sezioneQ1Questionario;
	@NotNull
	@JsonString
	private String sezioneQ2Questionario;
	@NotNull
	@JsonString
	private String sezioneQ3Questionario;
	@NotNull
	@JsonString
	private String sezioneQ4Questionario;
}