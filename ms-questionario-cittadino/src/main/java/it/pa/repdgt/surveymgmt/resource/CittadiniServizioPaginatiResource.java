package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "serviziResource")
public class CittadiniServizioPaginatiResource implements Serializable {
	private static final long serialVersionUID = -2324352133478003836L;

	@JsonProperty(value = "servizi")
	private List<CittadinoServizioResource> cittadiniServizioResource; 
	
	@JsonProperty(value = "numeroPagine")
	private Integer numeroPagine;
	
	@JsonProperty(value = "numeroCittadini")
	private Integer numeroCittadini;
	
	@JsonProperty(value = "numeroQuestionariCompilati")
	private Long numeroQuestionariCompilati;
}