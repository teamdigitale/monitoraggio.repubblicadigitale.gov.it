package it.pa.repdgt.shared.entity.key;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ProgrammaXQuestionarioTemplateKey implements Serializable {
	private static final long serialVersionUID = 7418367635109954696L;

	@Column(name = "PROGRAMMA_ID")
	private Long idProgramma;
	
	@Column(name = "QUESTIONARIO_TEMPLATE_ID")
	private String idQuestionarioTemplate;
}