package it.pa.repdgt.programmaprogetto.request;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProgettoFiltroRequest extends FiltroRequest implements Serializable {
	private static final long serialVersionUID = -7482749406950994870L;

	@JsonProperty(value = "filtroIdsProgrammi")
	private List<String> idsProgrammi;
}