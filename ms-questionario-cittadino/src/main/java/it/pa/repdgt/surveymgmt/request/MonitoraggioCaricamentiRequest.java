package it.pa.repdgt.surveymgmt.request;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MonitoraggioCaricamentiRequest {

	@JsonProperty("intervento")
	private String intervento;

	@JsonProperty("idProgetto")
	private Long idProgetto; 

	@JsonProperty("idProgramma")
	private Long idProgramma; 

	@JsonProperty("idEnti")
	private List<Long> idEnti;

	@JsonProperty("dataInizio")
	private Date dataInizio;

	@JsonProperty("dataFine")
	private Date dataFine;

	@JsonProperty("currPage")
	private Integer currPage;

	@JsonProperty("pageSize")
	private Integer pageSize;

	@JsonProperty("orderBy")
	private String orderBy;

	@JsonProperty("direction")
	private String direction;
}