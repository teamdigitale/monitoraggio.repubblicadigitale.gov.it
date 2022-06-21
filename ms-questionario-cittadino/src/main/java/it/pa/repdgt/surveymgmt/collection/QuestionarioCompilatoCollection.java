package it.pa.repdgt.surveymgmt.collection;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;

/**
 * Classe QuestionarioTemplateIstanzaCollection mappa un template di questionario.
 *  
 * */
@Document(collection = "questionarioTemplateIstanza")
@Setter
@Getter
public class QuestionarioCompilatoCollection implements Serializable {
	private static final long serialVersionUID = -5135985858663895848L;
	
	// corrisponde all'id della collection 'questionario-template'
	@Id
	@NotNull
	@Field(name = "survey-instance-id")
	private String idQuestionarioCompilato;
	
	@Field(name = "sections")
	private List<DatiIstanza> sezioniQuestionarioTemplateIstanze = new ArrayList<>();
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraCreazione")
	private Date dataOraCreazione;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraAggiornamento")
	private Date dataOraUltimoAggiornamento;

	@Setter
	@Getter
	public static class DatiIstanza implements Serializable {
		private static final long serialVersionUID = -5883239875068845224L;
		
		@Field(name = "question-answer")
		@NotNull
		private Object domandaRisposta;
	}
}