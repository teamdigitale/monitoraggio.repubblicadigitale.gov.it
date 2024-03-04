package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import it.pa.repdgt.shared.entity.TipologiaServizioEntity;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
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
	private String statoServizio;
	private String nominativoFacilitatore;
	private List<TipologiaServizioEntity> listaTipologiaServizio;
	private SezioneQ3Collection sezioneQ3compilato;
	private QuestionarioTemplateCollection questionarioTemplateSnapshot;
	private Date dataServizio;
	private Date dataOraCreazione;
	private Date dataOraAggiornamento;
}