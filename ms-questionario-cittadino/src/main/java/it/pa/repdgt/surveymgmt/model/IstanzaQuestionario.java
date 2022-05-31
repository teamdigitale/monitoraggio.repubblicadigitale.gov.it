package it.pa.repdgt.surveymgmt.model;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

import com.mongodb.DBObject;

import lombok.Getter;
import lombok.Setter;

/**
 * Classe IstanzaQuestionario mappa i dati di una istanza di un template di questionaario.
 * 
 * Un DataInstanceTemplate ingloba:
 * 
 * 		- id:  		 				Identificativo dei dati di istanza
 *  	- dataObject:    			I dati dell'istanza del questionario
 *  	- bozza:					Definisce se i dati sono di istanza del questionario sono in bozza
 *  								(Quindi se l'istanza del questionario è in bozza)
 *  	- dataOraCreazione:  		La data di creazione dei di istanza
 *  	- dataOraAggiornamento:     La data di aggiornamento dei dati di istanza
 * */

@Setter
@Getter
public class IstanzaQuestionario implements Serializable {
	private static final long serialVersionUID = -3664374329003067289L;

	@NotNull
	private String id;
	
	@NotNull
	private DBObject datiIstanza;
	
	private boolean bozza;
	
	@Field(value = "dataCreazione")
	private Date dataOraAggiornamento;

	@Field(value = "dataAggiornamento")
	private Date dataOraCreazione;
	
	public IstanzaQuestionario(DBObject dataObject) {
		super();
		this.id = new ObjectId().toHexString();
		this.datiIstanza = dataObject;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setDataObject(DBObject dataObject) {
		this.datiIstanza = dataObject;
	}

	public void setUpdatingTimestamp(Date updatingTimestamp) {
		this.dataOraCreazione = updatingTimestamp;
	}
}