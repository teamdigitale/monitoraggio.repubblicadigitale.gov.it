package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;

import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DettaglioServizioBean implements Serializable {
	private static final long serialVersionUID = 7237761000675359461L;

	private String nomeServizio;
	private String nomeEnte;
	private String nomeSede;
	private String tipologiaServizio;
	private SezioneQ3Collection sezioneQ3compilato;
}