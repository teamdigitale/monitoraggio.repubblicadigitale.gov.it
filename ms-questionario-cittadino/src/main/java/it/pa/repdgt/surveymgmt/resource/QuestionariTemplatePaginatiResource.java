package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@JsonRootName(value = "questionariTemplateResource")
public class QuestionariTemplatePaginatiResource implements Serializable {
	private static final long serialVersionUID = -7322620530605569070L;

	@JsonProperty(value = "questionariTemplate")
	private List<QuestionarioTemplateLightResource> questionariTemplate; 
	
	@JsonProperty(value = "numeroPagine")
	private Integer numeroPagine;
	
	@JsonProperty(value = "numeroTotaleElementi")
	private Long numeroTotaleElementi;
}