package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.surveymgmt.dto.CittadinoDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CittadiniPaginatiResource implements Serializable {
	private static final long serialVersionUID = -8493051841913162499L;

	@JsonProperty(value = "cittadini")
	private List<CittadinoDto> cittadini; 
	
	@JsonProperty(value = "numeroPagine")
	private Integer numeroPagine;
	
	@JsonProperty(value = "numeroTotaleElementi")
	private Long numeroTotaleElementi;
}