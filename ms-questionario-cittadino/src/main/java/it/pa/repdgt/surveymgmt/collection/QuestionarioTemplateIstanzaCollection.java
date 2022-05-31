package it.pa.repdgt.surveymgmt.collection;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.mongodb.DBObject;

import lombok.Getter;
import lombok.Setter;

/**
 * Classe QuestionarioTemplateIstanzaCollection mappa un template di questionario.
 *  
 * */
@Document(collection = "questionarioTemplateIstanza")
@Setter
@Getter
public class QuestionarioTemplateIstanzaCollection implements Serializable {
	private static final long serialVersionUID = -5135985858663895848L;
	
	// corrisponde all'id della collection 'questionario-template'
	@Id
	@NotNull
	@Field(name = "survey-instance-id")
	private String idQuestionarioTemplateIstanza;
	
	@Field(name = "sections")
	private List<DatiIstanza> sezioniQuestionarioTemplateIstanze = new ArrayList<>();

	@Setter
	@Getter
	public class DatiIstanza implements Serializable {
		private static final long serialVersionUID = -5883239875068845224L;
		
		@Field(name = "question-answer")
		@NotNull
		private DBObject domandaRisposta;
	}
}