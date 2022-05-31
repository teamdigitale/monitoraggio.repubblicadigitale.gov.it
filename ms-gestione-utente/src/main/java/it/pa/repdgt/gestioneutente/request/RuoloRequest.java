package it.pa.repdgt.gestioneutente.request;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RuoloRequest {
	@JsonProperty(value = "nomeRuolo")
	@NotBlank
	private String nomeRuolo;
	
	@JsonProperty(value = "codiciGruppi")
	@NotNull
	private List<String> codiciGruppi;
}