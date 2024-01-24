package it.pa.repdgt.opendata.projection;

import it.pa.repdgt.shared.entity.tipologica.FasciaDiEtaEntity;

public interface OpenDataCittadinoProjection {
	public String getGenere();

	public String getTitoloDiStudio();

	public FasciaDiEtaEntity getFasciaDiEta();

	public String getOccupazione();

	public String getPolicy();

	public String getServizioId();

	public String getTipologiaServizio();

	public String getNomeServizio();

	public String getIdTemplateQ3Compilato();

	public String getSedeId();

	public String getNomeSede();

	public String getComuneSede();

	public String getProvinciaSede();

	public String getRegioneSede();

	public String getCapSede();

	public String getIdProgramma();

	public String getIdProgetto();

	public String getDataFruizioneServizio();
}