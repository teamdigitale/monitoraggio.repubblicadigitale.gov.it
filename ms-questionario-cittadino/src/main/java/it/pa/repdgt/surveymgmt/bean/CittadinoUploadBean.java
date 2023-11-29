package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CittadinoUploadBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private String codiceFiscale;
	private String tipoDocumento;
	private String numeroDocumento;
	private String genere;
	private String fasciaDiEtaId;
	private String titoloStudio;
	private String statoOccupazionale;
	private String cittadinanza;
	private String esito;

	public CittadinoUploadBean() {
		super();
	}

	public CittadinoUploadBean(String codiceFiscale, String tipoDocumento,
			String numeroDocumento, String genere, String fasciaDiEtaId, String titoloStudio, String statoOccupazionale,
			String cittadinanza) {
		super();
		this.codiceFiscale = codiceFiscale;
		this.tipoDocumento = tipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.genere = genere;
		this.fasciaDiEtaId = fasciaDiEtaId;
		this.titoloStudio = titoloStudio;
		this.statoOccupazionale = statoOccupazionale;
		this.cittadinanza = cittadinanza;
	}
}