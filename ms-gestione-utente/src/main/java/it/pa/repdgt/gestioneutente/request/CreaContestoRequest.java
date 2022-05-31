package it.pa.repdgt.gestioneutente.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonRootName(value = "CreaContesto")
public class CreaContestoRequest implements Serializable {
	private static final long serialVersionUID = -6654227879250469320L;

	@JsonProperty(value = "codiceFiscale")
	@NotBlank
	private String codiceFiscale;
}
