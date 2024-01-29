package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import it.pa.repdgt.shared.entityenum.ConsensoTrattamentoDatiEnum;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ConsensoTrattamentoDatiRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String codiceFiscaleCittadino;
	private String numeroDocumentoCittadino;
}