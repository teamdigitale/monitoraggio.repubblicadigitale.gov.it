package it.pa.repdgt.programmaprogetto.bean;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "SchedaProgetto")
public class SchedaProgettoBean implements Serializable {
	private static final long serialVersionUID = -4884780725372877896L;

	@JsonProperty(value = "dettagliInfoProgetto")
	private DettaglioProgettoBean dettaglioProgetto;
	@JsonProperty(value = "entiPartner")
	private List<DettaglioEntiPartnerBean> entiPartner;
	@JsonProperty(value = "sedi")
	private List<DettaglioSediBean> sedi;
	@JsonProperty(value = "idEnteGestoreProgetto")
	private Long idEnteGestoreProgetto;
}