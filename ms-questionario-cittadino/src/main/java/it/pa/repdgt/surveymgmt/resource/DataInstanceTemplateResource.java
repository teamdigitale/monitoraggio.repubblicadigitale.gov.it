package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.mongodb.DBObject;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonRootName(value = "IstanzaTemplateQuestionario")
@JsonInclude(value = Include.NON_NULL)
public class DataInstanceTemplateResource implements Serializable {
	private static final long serialVersionUID = 979278621623103148L;

	@JsonProperty(value = "id")
	private String id;
	@JsonProperty(value = "datiInstanceTemplateQustionario")
	private DBObject dataObject;
	@JsonProperty(value = "isDraft")
	private boolean isDraft;
	@JsonProperty(value = "dataCreazione")
	private Date creationTimestamp = new Date();
	@JsonProperty(value = "dataAggiornamento")
	private Date updatingTimestamp = null;
}
