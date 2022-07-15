package it.pa.repdgt.surveymgmt.collection;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "SezioneQ3")
@Setter
@Getter
public class SezioneQ3Collection implements Serializable {
	private static final long serialVersionUID = -7705276665716179896L;
	
	@Id
	private String mongoId;
	
	@Field(name = "id")
	private String id;

	@NotNull
	@Field(name = "sezioneQ3Compilato")
	private Object sezioneQ3Compilato;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraCreazione")
	private Date dataOraCreazione;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Field(name = "dataOraAggiornamento")
	private Date dataOraUltimoAggiornamento;
}