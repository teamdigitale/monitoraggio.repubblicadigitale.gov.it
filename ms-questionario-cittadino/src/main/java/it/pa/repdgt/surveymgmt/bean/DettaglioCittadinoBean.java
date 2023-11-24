package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DettaglioCittadinoBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long id;
	private String codiceFiscale;
	private String tipoDocumento;
	private String numeroDocumento;
	private String genere;
	private Long fasciaDiEta;
	private String titoloStudio;
	private String statoOccupazionale;
	private String provincia;
	private String cittadinanza;
}