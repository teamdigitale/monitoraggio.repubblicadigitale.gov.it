package it.pa.repdgt.surveymgmt.projection;

public interface DettaglioServizioSchedaCittadinoProjection {
	public Long getIdServizio();

	public Long getIdEnte();

	public String getNomeServizio();

	public Long getIdProgetto();

	public String getCodiceFiscaleFacilitatore();

	public String getIdQuestionarioCompilato();

	public String getStatoQuestionarioCompilato();

	public String getNomeSede();

	public String getProvincia();
}